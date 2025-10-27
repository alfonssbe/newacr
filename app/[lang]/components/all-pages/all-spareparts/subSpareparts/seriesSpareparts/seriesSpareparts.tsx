import getSubCatNameBySlug from '@/app/actions/get-SubCat_Name';
import getSeriesNameBySlug from '@/app/actions/get-Series_Name';
import getSubSubCatNameBySlug from '@/app/actions/get-SubSubCat_Name';
import { getTranslations } from 'next-intl/server';
import getAllSparepartBySeriesJsonld from '@/app/actions/jsonLd/get-all-sparepart-by-series-jsonld';
import SparepartBySeriesPage from './seriesSparepartsClient';

type Props = {
  params: { lang?: string, sparepartSubCategory?: string, sparepartSeries?: string }
}

export default async function SparepartBySeriesPageJsonLd({params}: Props) {
  const { lang = 'id', sparepartSubCategory = '', sparepartSeries = '' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const [subCatNameResult, seriesNameResult] = await Promise.allSettled([
    getSubCatNameBySlug(sparepartSubCategory),
    sparepartSubCategory === 'acr' ? getSeriesNameBySlug(sparepartSeries) : getSubSubCatNameBySlug(sparepartSeries)
  ]);

  const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
  const seriesName = seriesNameResult.status === 'fulfilled' ? seriesNameResult.value : { name: '' };
  const allsparepartserver = await getAllSparepartBySeriesJsonld(sparepartSubCategory, sparepartSeries); // SSR fetch

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",    
    "url": lang === 'id' ? `${baseUrl}/sparepart/${sparepartSubCategory}/${sparepartSeries}` : `${baseUrl}/${lang}/spareparts/${sparepartSubCategory}/${sparepartSeries}`, 
    "name": "ACR Speaker",
    "description": `${t('jsonLd-description-1')} ${subCatName?.name} ${seriesName?.name} Spareparts ${t('jsonLd-description-2')}`,
    "itemListElement": allsparepartserver?.map((sparepart: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": lang === 'id' ? `${baseUrl}/sparepart/${sparepart.slug}` : `${baseUrl}/${lang}/spareparts/${sparepart.slug}`,
        "name": sparepart.name,
        "description": sparepart.name,
        "image": `${baseUrl}${sparepart.coverUrl}`,
        "sku": sparepart.slug || sparepart.id,
        "brand": {
          "@type": "Brand",
          "name": "ACR Speaker"
        }
      }
    }))
  };

  return(
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className='sr-only'>{subCatName.name} {seriesName.name} Spareparts Series | ACR Speaker</h1>
      <h2 className='sr-only'>{t('h3 all product 1')} {subCatName.name} {seriesName.name} Spareparts {t('h3 all product 2')}</h2>
      <SparepartBySeriesPage params={params}/>
    </>
  );
}

