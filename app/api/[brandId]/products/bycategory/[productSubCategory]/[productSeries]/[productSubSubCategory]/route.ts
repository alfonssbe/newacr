import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ productSubCategory: string, productSeries: string, productSubSubCategory: string }> }
) {
  const params = await props.params;
  try {
    if (!params.productSubCategory) {
      return new NextResponse("Product Sub Category is required", { status: 400 });
    }
    
    if (!params.productSeries) {
        return new NextResponse("Product Series is required", { status: 400 });
      }

    if (!params.productSubSubCategory) {
      return new NextResponse("Product Sub Sub Category is required", { status: 400 });
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

    const productIdsSeries = productIdbySeries.map((value) => value.productId)

    const productIdbySubSubCat =  await prismadb.allProductCategory.findMany({
      where:{
          slug: params.productSubSubCategory,
          type: 'Sub Sub Category'
      },
      select:{
          productId: true
      }
    })

    const productIdsSubSubCat = productIdbySubSubCat.map((value) => value.productId)

    const tempProductIds = productIdsSubCat.filter(id => productIdsSeries.includes(id));
    const finalProductIds = tempProductIds.filter(id => productIdsSubSubCat.includes(id));

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