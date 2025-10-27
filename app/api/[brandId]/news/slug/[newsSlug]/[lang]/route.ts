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

    const allnews = await prismadb.news.findFirst({
      where: {
        brandId: params.brandId,
        ...(params.lang === 'id'
          ? { slug: params.newsSlug }
          : { slug_english: params.newsSlug }),
      },
      select: {
        id: true,
        title: true,
        title_english: true,
        slug: true,
        slug_english: true,
        link_placeholder: true,
        link_url: true,
        description: true,
        description_english: true,
        event_date: true,
        updatedAt: true,
        news_img: {
          select: {
            url: true
          }
        }
      }
    });

    return NextResponse.json(allnews);
  } catch (error) {
    console.log('[ONE_NEWS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};