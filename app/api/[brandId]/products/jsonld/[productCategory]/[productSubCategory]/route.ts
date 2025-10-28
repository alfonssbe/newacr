import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ productCategory: string, productSubCategory: string }> }) {
  const params = await props.params;
  try {
    
    if (!params.productCategory) {
      return new NextResponse("Product Category is required", { status: 400 });
    }
    if (!params.productSubCategory) {
      return new NextResponse("Product Sub Category is required", { status: 400 });
    }
    
    const productIdbyCat =  await prismadb.allProductCategory.findMany({
      where:{
          slug: params.productSubCategory,
          type: {
            in: ['Sub Category', 'Sub Sub Category']
          }
      },
      select:{
          productId: true
      }
    })

    const productIds = productIdbyCat.map((value) => value.productId)

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
            in: productIds
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
    console.log('[PRODUCT_BY_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};