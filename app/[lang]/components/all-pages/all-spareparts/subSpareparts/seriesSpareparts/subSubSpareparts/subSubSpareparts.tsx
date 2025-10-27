import getSeriesNameBySlug from '@/app/actions/get-Series_Name';
import getSubCatNameBySlug from '@/app/actions/get-SubCat_Name';
import getSubSubCatNameBySlug from '@/app/actions/get-SubSubCat_Name';
import { getTranslations } from 'next-intl/server';
import getAllSparepartBySubSubCategoryJsonld from '@/app/actions/jsonLd/get-all-sparepart-by-sub-sub-category-jsonld';
import SparepartBySubSubCategoryPage from './subSubSparepartsClient';

type Props = {
  params: { lang?: string, sparepartSubCategory?: string, sparepartSeries?: string, sparepartSubSubCategory?: string }
}

export default async function SparepartBySubSubCategoryPageJsonLd({params}: Props) {
  const { lang = 'id', sparepartSubCategory = '', sparepartSeries = '', sparepartSubSubCategory = '' } = params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const [subCatNameResult, seriesNameResult, subSubCatNameResult] = await Promise.allSettled([
    getSubCatNameBySlug(sparepartSubCategory),
    getSeriesNameBySlug(sparepartSeries),
    getSubSubCatNameBySlug(sparepartSubSubCategory),
  ]);

  const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
  const seriesName = seriesNameResult.status === 'fulfilled' ? seriesNameResult.value : { name: '' };
  const subSubCatName = subSubCatNameResult.status === 'fulfilled' ? subSubCatNameResult.value : { name: '' };
  const allsparepartserver = await getAllSparepartBySubSubCategoryJsonld(sparepartSubCategory, sparepartSeries, sparepartSubSubCategory); // SSR fetch

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",    
    "url": lang === 'id' ? `${baseUrl}/sparepart/${sparepartSubCategory}/${sparepartSeries}/${sparepartSubSubCategory}` : `${baseUrl}/${lang}/spareparts/${sparepartSubCategory}/${sparepartSeries}/${sparepartSubSubCategory}`, 
    "name": "ACR Speaker",
    "description": `${t('jsonLd-description-1')} ${subCatName?.name} ${seriesName?.name} ${subSubCatName?.name} Spareparts ${t('jsonLd-description-2')}`,
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
      <h1 className='sr-only'>{subCatName.name} {seriesName.name} {subSubCatName.name} Spareparts Series | ACR Speaker</h1>
      <h2 className='sr-only'>{t('h3 all product 1')} {subCatName.name} {seriesName.name} {subSubCatName.name} Spareparts {t('h3 all product 2')}</h2>
      <SparepartBySubSubCategoryPage params={params} />
    </>
  );
}

