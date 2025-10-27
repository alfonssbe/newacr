"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/[lang]/components/ui/breadcrumb";
import "./styles.scss";
import { useEffect, useState } from "react";
import { NewsType } from "@/app/types";
import { redirect } from "next/navigation";
import { Loader } from "@/app/[lang]/components/ui/loader";
import { useLocale, useTranslations } from "next-intl";
import DOMPurify from 'dompurify';
import { LazyImageCustom } from "@/app/[lang]/components/lazyImageCustom";

type Props = {
  oneNews: NewsType
}

export default function SingleNewsPage(props: Props) {
  const t = useTranslations('News Page');
  const [news, setNews] = useState<NewsType>()
  const [loading, setLoading] = useState<boolean>(true)
  const locale = useLocale()
  useEffect(() => {
      const fetchData = async () => {
        try {
          setNews(props.oneNews)
          setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
        redirect('/')
      }
    };

    fetchData();
  }, []); 


  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString(t('news-date-format'), options);
  };

  return (
    loading ? 
      <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-foreground z-50">
        <Loader />
      </div>
    :
    news &&
    <>
      <div className="bg-white -z-10">
        <div className="container mx-auto xl:px-24 lg:px-16 px-10 py-8">
          <div className="pb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={locale === 'id' ? '/' : `/${locale}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={locale === 'id' ? '/berita' : `/${locale}/news`}>{t("news-breadcrumb")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{news.title.length > 10 ? `${news.title.slice(0, 10)}...` : news.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="w-full">
            <div className="flex items-center h-fit md:w-1/2 w-full py-4">
              <LazyImageCustom 
              src={news.news_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${news.news_img_url}` : news.news_img_url} 
              alt={news.title}
              width={500}
              height={500}
              classname="w-full h-fit"
              lazy={true}/>
            </div>
            <h1 className="lg:text-3xl text-xl text-black font-bold py-2">
              {news.title}
            </h1>
            <h2 className="lg:text-base text-sm text-gray-500 pb-8">
              {formatDate(news.event_date.toString())}
            </h2>
            <div
              className="news-content text-base text-black pb-8 [&>iframe]:max-w-full"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(news!.description, {
                  ADD_TAGS: ['iframe'],
                  ADD_ATTR: ['allowfullscreen', 'frameborder', 'scrolling', 'src', 'width', 'height', 'class'],
                }).replace(
                  /<iframe([^>]*)><\/iframe>/g,
                  `<div class="responsive-iframe-wrapper"><iframe$1></iframe></div>`
                ),
              }}
            />
          </div>
        </div>
      </div>
    </>    
  );
};

