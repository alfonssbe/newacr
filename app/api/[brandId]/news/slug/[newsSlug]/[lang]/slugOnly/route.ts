import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, newsSlug: string, lang: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const selectFields =
      params.lang === 'id'
        ? { slug_english: true } // only return slug_english
        : { slug: true };        // only return slug

    const allnews = await prismadb.news.findFirst({
      where: {
        brandId: params.brandId,
        ...(params.lang === 'id'
          ? { slug: params.newsSlug }
          : { slug_english: params.newsSlug }),
      },
      select: selectFields
    });

    return NextResponse.json(allnews ? params.lang === 'id' ? allnews.slug_english : allnews.slug : params.newsSlug);
  } catch (error) {
    console.log('[ONE_NEWS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};