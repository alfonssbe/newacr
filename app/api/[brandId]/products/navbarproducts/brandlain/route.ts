import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }


    const categories_desibel_curve = await prismadb.allProductCategory.findMany({
      where: {
          type: "Sub Category",
          name: {
            in: ["Curve", "Desibel"]
          }
      },
      select: {
          productId: true
      }
    });

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: categories_desibel_curve.map(category => category.productId)
        },
        brandId: params.brandId,
        isArchived: false,
      },
      select:{
          name: true,
          slug: true,
          id: true,
      }
    });

    const image_url = await prismadb.cover_Image.findMany({
      where: {
        productId: {
          in: products.map(product => product.id)
        }
      },
      select:{
        productId: true,
        url: true
      }
    })

    const categories = await prismadb.allProductCategory.findMany({
      where:{
          productId:{
              in: products.map(product => product.id)
          }
      },
      select:{
          type: true,
          name: true,
          productId: true
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
        url: final_Url
      };
  });

  const sortedProducts = productsWithCategoriesandImage.sort((a, b) => a.productSlug.localeCompare(b.productSlug));
    return NextResponse.json(sortedProducts);


  } catch (error) {
    console.log('[NAVBAR_PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};