"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SwiperCarouselNews from "@/app/[lang]/components/ui/swipercarouselnews";
import { NewsType } from "@/app/types";
import getAllNews from "@/app/actions/get-all-news";
import { Loader } from "@/app/[lang]/components/ui/loader";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import DOMPurify from 'dompurify'; 
import { useLocale, useTranslations } from "next-intl";

const News: React.FC = () => {
  const t = useTranslations('Latest News Home');
  const [allNews, setAllNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale()

  // Detect if the device is mobile or desktop
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 769px)" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let tempData = await getAllNews("3", t('latest-news-date-format').split('-')[0] ?? 'id');
        setAllNews(tempData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full h-fit bg-background">
      <div className="container mx-auto xl:px-24 lg:px-16 px-10 xl:pt-8 lg:pt-6 pt-4 h-fit items-start block text-start">
        <h2 className="text-3xl font-bold text-foreground pb-4 w-full flex justify-center">{t('latest-news-title')}</h2>
      {loading ? (
        <div className="flex items-center justify-center w-full h-[500px] z-50">
          <Loader />
        </div>
      ) : (
        <>
          {/* Render desktop version only when on desktop */}
          {isDesktop && (
            <div className="pt-4 h-full md:grid md:grid-cols-3 items-center hidden">




              {allNews.map((value, index) => (
                <div
                  className={`px-4 h-full`}
                  key={index}
                >
                  <Image
                    src={value.news_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.news_img_url}` : value.news_img_url}
                    alt={value.title}
                    width={500}
                    height={500}
                    className="w-auto lg:max-h-[350px] max-h-[250px] mx-auto rounded-xl"
                    // className="w-auto lg:h-[300px] h-[200px] mx-auto rounded-xl"
                    priority
                  />
                  <div className="flex text-center">
                    <div className="text-sm text-muted-foreground w-full line-clamp-1 my-4">
                      {new Date(value.event_date).toLocaleDateString(t("latest-news-date-format"), {
                        year: 'numeric',
                        month: 'long',  // Full month name
                        day: '2-digit'  // Day with leading zero if necessary
                      })}
                    </div>
                  </div>
                  <div className="text-center flex">
                    <h3 className="xl:text-2xl lg:text-xl text-base font-bold text-black w-full line-clamp-3 xl:h-[96px] lg:h-[86px] h-[76px]">
                      {value.title}
                    </h3>
                  </div>
                  <div className="text-center flex">
                  <h4
                    className="text-black w-full line-clamp-4 my-3 xl:text-base text-sm xl:h-[96px] h-[80px]"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value.description) }}
                  ></h4>
                  </div>
                  <div className="flex justify-center pb-4 pt-2">
                    <Button asChild size={"lg"} variant={"default"} className="rounded-full w-3/4 ">
                      <Link
                        href={locale === 'id' ? `/berita/${value.slug}` : `/${locale}/news/${value.slug}`}
                        className="text-white font-bold"
                      >
                        {t('latest-news-button-desc')}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render mobile version only when on mobile */}
          {isMobile && (
            <div className="xl:px-32 xl:pb-8 lg:px-20 lg:pb-6 md:px-10 px-0 pb-4 pt-4 md:hidden block">
              <SwiperCarouselNews news={allNews} />
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default News;
