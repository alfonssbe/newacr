import getAllNews from "@/app/actions/get-all-news";
import { getTranslations } from "next-intl/server";
import News from "./newsClient";

type Props = {
  params: { lang?: string };
};

export default async function NewsJsonLd({ params }: Props) {
  const { lang = 'id' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const allnewsserver = await getAllNews('all', lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",      
    "url": lang === 'id' ? `${baseUrl}/berita` : `${baseUrl}/${lang}/news`, 
    "name": `${t('generateMetadata-title-news')} | ACR Speaker`,
    "description": `${t('generateMetadata-description-news')}`,
    "itemListElement": allnewsserver?.map((news, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": lang === 'id' ? `${baseUrl}/berita/${news.slug}` : `${baseUrl}/${lang}/news/${news.slug}`,
      "item": {
        "@type": "NewsArticle",
        "headline": news.title,
        "image": `${baseUrl}${news.news_img_url}`,
        "description": news.description,
        "datePublished": news.event_date,
        "dateModified": news.updatedAt,
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">{t('generateMetadata-title-news')} | ACR Speaker</h1>
      <News news={allnewsserver}/>
  </>
  );
}