import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
        isArchived: false,
      },
      select:{
          name: true,
          slug: true,
          id: true,
          haveSparepart: true
      }
    });

    const productIds = products.map(product => product.id);

    const categories = await prismadb.allProductCategory.findMany({
      where:{
          productId:{
              in: productIds
          }
      },
      select:{
          type: true,
          name: true,
          productId: true
      }
    })

    const image_url = await prismadb.cover_Image.findMany({
      select:{
        productId: true,
        url: true
      }
    })
    
  const productsWithCategoriesandImage = products.map(product => {
      const productCategories = categories.filter(category => category.productId === product.id);
      
      const categoryDetails = productCategories.map(category => ({
      type: category.type,
      name: category.name,
      }));

      const productImage = image_url.filter(image => image.productId === product.id);
      

      const final_Url = productImage.map(url => ({
       url: url.url
      }));
  
      return {
        productName: product.name,
        productSlug: product.slug,
        categories: categoryDetails,
        url: final_Url,
        haveSparepart: product.haveSparepart
      };
  });

  const sortedProducts = productsWithCategoriesandImage.sort((a, b) => a.productSlug.localeCompare(b.productSlug));
    return NextResponse.json(sortedProducts);


  } catch (error) {
    console.log('[NAVBAR_PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};