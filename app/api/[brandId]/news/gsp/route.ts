import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }  
    const allnews = await prismadb.news.findMany({
        where: {
          brandId: params.brandId,
        },
        select: {
          slug: true,
          slug_english: true,
        }
      });
  
      return NextResponse.json(allnews);
  } catch (error) {
    console.log('[NEWS_GET_GSP]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};