import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
  ) {
    try {
      const product = await prismadb.product.findMany({
        select: {
          slug: true,
        },
        where:{
          isArchived: false,
        }
      });
      return NextResponse.json(product);
    } catch (error) {
      console.log('[ALL_PRODUCT_GSP_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };