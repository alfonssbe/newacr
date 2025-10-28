import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ productCategory: string, productSubCategory: string, productSeries: string, productSubSubCategory: string }> }
) {
  const params = await props.params;
  try {
    if (!params.productCategory) {
      return new NextResponse("Product Category is required", { status: 400 });
    }

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

    const productIdbySubSeriesCat =  await prismadb.allProductCategory.findMany({
      where:{
          slug: params.productSeries,
          type: {
            in: ['Series']
          }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubSubCat = productIdbySubSeriesCat.map((value) => value.productId)

    const finalProductIds = productIdsSubCat.filter(id => productIdsSubSubCat.includes(id));

    const productIdbySubSubCat =  await prismadb.allProductCategory.findMany({
      where:{
          slug: params.productSubSubCategory,
          type: {
            in: ['Sub Sub Category']
          }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubSubSubCat = productIdbySubSubCat.map((value) => value.productId)

    const finalProductIdsFix = finalProductIds.filter(id => productIdsSubSubSubCat.includes(id));

    const product = await prismadb.product.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          allCat: {
            select:{
              type: true,
              name: true,
              slug: true
            }
          },
          cover_img: {
            select: {
              url: true
            }
          },
        },
        where:{
          id: {
            in: finalProductIdsFix
          },
          isArchived: false,
          allCat: {
            some: {
              type: 'Category',
              slug: params.productCategory === 'drivers' || params.productCategory === 'driver' ? 'drivers' : 'spareparts'
            }
          }
        }
      });
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_BY_SUB_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};