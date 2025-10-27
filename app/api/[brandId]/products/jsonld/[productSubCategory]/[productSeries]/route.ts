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

    const productIdbySubSeriesCat =  await prismadb.allProductCategory.findMany({
      where:{
          slug: params.productSeries,
          type: {
            in: ['Series', 'Sub Sub Category']
          }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubSubCat = productIdbySubSeriesCat.map((value) => value.productId)

    const finalProductIds = productIdsSubCat.filter(id => productIdsSubSubCat.includes(id));

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
            in: finalProductIds
          },
          isArchived: false,
          allCat: {
            some: {
              type: 'Category',
              name: 'Drivers'
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