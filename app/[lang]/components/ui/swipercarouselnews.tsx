import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

// import required modules
import { FreeMode } from 'swiper/modules';
import Link from 'next/link';
import { NewsType } from '@/app/types';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify'; 
import { useLocale, useTranslations } from 'next-intl';
import { LazyImageCustom } from '../lazyImageCustom';

interface SwiperCarouselNewsProps {
  news: NewsType[];
}

export default function SwiperCarouselNews({ news }: SwiperCarouselNewsProps) {
  const t = useTranslations('Latest News Home');
  const locale = useLocale()
  return (
    <Swiper
      slidesPerView={1.25}
      spaceBetween={10}
      freeMode={true}
      modules={[FreeMode]}
      className="mySwiper"   
      autoHeight={true}
    >
     {news.map((value, index) => (
      <SwiperSlide key={index}>
          <div className={`${index === 0 ? 'pr-4': index === news.length - 1 ? 'pl-4' : 'px-2'}`} key={index}>
          <LazyImageCustom
            src={value.news_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.news_img_url}` : value.news_img_url}
            alt={value.title}
            width={500}
            height={500}
            classname='w-auto max-h-[350px] mx-auto rounded-xl'
            lazy={false}
          />
          {/* <div className="h-[350px] flex items-center">
            <Image
              src={value.news_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.news_img_url}` : value.news_img_url}
              alt={value.title}
              width={500}
              height={500}
              className="w-fit h-fit mx-auto rounded-xl"
              loading="lazy"
            />
          </div> */}
          <div className="flex text-center">
            <div className="text-sm text-muted-foreground w-full line-clamp-1 my-4">
              {new Date(value.event_date).toLocaleDateString(t("latest-news-date-format"), {
                year: 'numeric',
                month: 'long',  // Full month name
                day: '2-digit'  // Day with leading zero if necessary
              })}
            </div>
          </div>
          {/* Title */}
          <div className="text-center flex">
            <div className="sm:text-xl text-base font-bold text-black w-full sm:line-clamp-2 line-clamp-3 sm:h-[56px] h-[66px]">
              {value.title}
            </div>
          </div>

          {/* Description */}
          {/* <div
            className="text-foreground w-full line-clamp-3 my-4 min-h-[72px]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value.description) }}
          ></div> */}
          <div className="text-center flex">
            <h4
              className="text-black w-full line-clamp-4 my-3 xl:text-base text-sm xl:h-[96px] h-[80px]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value.description) }}
            ></h4>
          </div>

          {/* Button (pushed to bottom) */}
          <div className="items-start pb-4 pt-2 w-full">
            <Button asChild size={'lg'} variant={'default'} className='w-full'>
              <Link href={locale === 'id' ? `/berita/${value.slug}` : `/${locale}/news/${value.slug}`} className='text-background font-bold'>
                {t('latest-news-button-desc')}
              </Link>
            </Button>
          </div>
        </div>
      </SwiperSlide>
    ))}
    </Swiper>
  );
}
