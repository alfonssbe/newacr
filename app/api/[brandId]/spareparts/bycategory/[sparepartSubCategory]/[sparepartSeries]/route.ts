import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ sparepartSubCategory: string, sparepartSeries: string }> }
) {
  const params = await props.params;
  try {
    if (!params.sparepartSubCategory) {
      return new NextResponse("Sparepart Sub Category is required", { status: 400 });
    }

    if (!params.sparepartSeries) {
      return new NextResponse("Sparepart Series is required", { status: 400 });
    }
    
    const productIdbySubCat =  await prismadb.allProductCategory.findMany({
      where:{
          slug: params.sparepartSubCategory,
          type: 'Sub Category'
      },
      select:{
          productId: true
      }
    })

    const productIdsSubCat = productIdbySubCat.map((value) => value.productId)

    let productIdsSeries: string[] = []
    if(params.sparepartSubCategory === "curve" || params.sparepartSubCategory === "desibel"){
      const productIdbySeries =  await prismadb.allProductCategory.findMany({
        where:{
            slug: params.sparepartSeries,
            type: 'Sub Sub Category'
        },
        select:{
            productId: true
        }
      })
      productIdsSeries = productIdbySeries.map((value) => value.productId)
    }
    else{
      const slugs: string[] = params.sparepartSeries === 'pro'
      ? ['pro', 'black', 'black-magic', 'classic']
      : [params.sparepartSeries];
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
            name: 'Spareparts'
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
    console.log('[SPAREPART_BY_SUB_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};