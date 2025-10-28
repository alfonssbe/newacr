import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, props: { params: Promise<{ productCategory: string }> }
  ) {
  const params = await props.params;
    try {
      if (!params.productCategory) {
        return new NextResponse("Product Category is required", { status: 400 });
      }
    
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
      console.log('[ALL_PRODUCT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };