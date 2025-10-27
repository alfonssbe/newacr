import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, totalNews: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }
  
    if(params.totalNews === 'all'){
      const allnews = await prismadb.news.findMany({
        where: {
          brandId: params.brandId,
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
        },
        orderBy: {
          event_date: 'desc',
        },
      });
  
      return NextResponse.json(allnews);
    }
    else{
      const allnews = await prismadb.news.findMany({
        where: {
          brandId: params.brandId,
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
        },
        orderBy: {
          event_date: 'desc',
        },
        take: Number(params.totalNews)
      });
      return NextResponse.json(allnews);
    }
  } catch (error) {
    console.log('[NEWS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};