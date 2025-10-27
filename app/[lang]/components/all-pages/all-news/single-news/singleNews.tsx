import getOneNews from "@/app/actions/get-one-news";
import SingleNewsPage from "./singleNewsClient";

type Props = {
  params: { lang?: string, newsSlug?: string };
};

export default async function SingleNewsPageJsonLd({ params }: Props) {
  const { lang = 'id', newsSlug = '' } = params;
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const news = await getOneNews(newsSlug, lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news?.title,
    "image": `${baseUrl}${news?.news_img_url}`,
    "description": news?.description,
    "datePublished": news?.event_date,
    "dateModified": news?.updatedAt,
    "url": lang === 'id' ? `${baseUrl}/berita/${news?.slug}` : `${baseUrl}/${lang}/news/${news?.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": lang === 'id' ? `${baseUrl}/berita/${news?.slug}` : `${baseUrl}/${lang}/news/${news?.slug}`
    }
  };

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />
      <SingleNewsPage oneNews={news} />
    </>    
  );
};

