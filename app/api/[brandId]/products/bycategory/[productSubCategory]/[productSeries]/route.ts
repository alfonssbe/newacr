import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ productSubCategory: string, productSeries: string }> }
) {
  const params = await props.params;
  try {
    if (!params.productSubCategory) {
      return new NextResponse("Product Sub Category is required", { status: 400 });
    }

    if (!params.productSeries) {
      return new NextResponse("Product Series is required", { status: 400 });
    }
    
    const productIdbySubCat =  await prismadb.allProductCategory.findMany({
      where:{
          slug: params.productSubCategory,
          type: 'Sub Category'
      },
      select:{
          productId: true
      }
    })

    const productIdsSubCat = productIdbySubCat.map((value) => value.productId)

    let productIdsSeries: string[] = []
    if(params.productSubCategory === "curve" || params.productSubCategory === "desibel"){
      const productIdbySeries =  await prismadb.allProductCategory.findMany({
        where:{
            slug: params.productSeries,
            type: 'Sub Sub Category'
        },
        select:{
            productId: true
        }
      })
      productIdsSeries = productIdbySeries.map((value) => value.productId)
    }
    else{
      const slugs: string[] = params.productSeries === 'pro'
      ? ['pro', 'black', 'black-magic', 'classic']
      : [params.productSeries];
      const productIdbySeries =  await prismadb.allProductCategory.findMany({
        where:{
            slug: { in: slugs },
            type: 'Series'
        },
        select:{
            productId: true
        }
      })
      productIdsSeries = productIdbySeries.map((value) => value.productId)
    }
  

    const finalProductIds = productIdsSubCat.filter(id => productIdsSeries.includes(id));

    const product = await prismadb.product.findMany({
      where: {
        id:{
          in: finalProductIds
        },
        isArchived: false,
        allCat: {
          some: {
            type: 'Category',
            name: 'Drivers'
          }
        }
      },
      select: {
        id: true,
        slug: true,
        name: true,
        allCat: {
          select: {
            id: true,
            type: true,
            name: true,
            slug: true
          }
        },
        specification: {
          select: {
            voice_coil_diameter: true,
            spl: true,
            impedansi: true,
            program_power: true,
          },
        },
        cover_img: {
          select: {
            url: true
          }
        },
        size: {
          select: {
            value: true,
            name: true
          }
        },
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_BY_SUB_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};