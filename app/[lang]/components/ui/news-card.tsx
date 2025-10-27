import Link from "next/link";
import { NewsType } from "@/app/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DOMPurify from 'dompurify'; 
import { useLocale, useTranslations } from "next-intl";
import { routing } from '@/i18n/routing';

interface NewsCardProps {
  data: NewsType;
}

const NewsCard: React.FC<NewsCardProps> =  ({ data }) => {  
  const t = useTranslations('News Page');
  const locale = useLocale(); // ✅ get current locale
  const eventDate = new Date(data.event_date).toLocaleDateString(t("news-date-format"), {
    year: 'numeric',
    month: 'long',  // Full month name
    day: '2-digit'  // Day with leading zero if necessary
  });  
  
  return ( 
    <div className="py-4">
      <div className="md:flex block items-center">    
        <div className="h-auto"> 
          <Image
            src={data.news_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.news_img_url}` : data.news_img_url} 
            alt={data.title} 
            width={300}
            height={300}
            className="w-full max-w-[250px] h-auto object-contain"
          />
        </div>
        <div className="md:w-2/3 md:pl-12">
          <h2 className="text-lg lg:text-xl font-bold text-black pb-2 md:pt-0 pt-4">
            {data.title}
          </h2>
          <h3 className="text-sm py-2 text-black">
            {eventDate}
          </h3>
          <h3 className="text-base py-2 text-black"  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description.length > 150
              ? `${data.description.slice(0, 150)}...`
              : data.description, {
                FORBID_TAGS: ['img', 'iframe'],
              }) }}>
          </h3>
          <div className="text-base py-2 text-black">
            <Button asChild size={'lg'} variant={'default'} className="sm:w-fit w-full">
              <Link
                href={locale === 'id' ? `/berita/${data.slug}` : `/${locale}/news/${data.slug}`}
                className='text-white font-bold'
              >
                {t('news-read-article')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
