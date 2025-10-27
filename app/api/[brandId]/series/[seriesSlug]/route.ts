import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, seriesSlug: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    
    if (!params.seriesSlug) {
      return new NextResponse("Series Slug is required", { status: 400 });
    }

    const series = await prismadb.allCategory.findFirst({
      where: {
        brandId: params.brandId,
        slug: params.seriesSlug,
        type: "Series"
      },
      select:{
        name: true,
        description: true
      }
    });
  
    return NextResponse.json(series);
  } catch (error) {
    console.log('[SERIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};