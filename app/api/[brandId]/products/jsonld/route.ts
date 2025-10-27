import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
  ) {
    try {
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
              name: 'Drivers'
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