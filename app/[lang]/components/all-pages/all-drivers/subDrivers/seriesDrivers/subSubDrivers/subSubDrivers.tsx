import getAllProductsBySubSubCategoryJsonld from '@/app/actions/jsonLd/get-all-products-by-sub-sub-category-jsonld';
import getSeriesNameBySlug from '@/app/actions/get-Series_Name';
import getSubCatNameBySlug from '@/app/actions/get-SubCat_Name';
import getSubSubCatNameBySlug from '@/app/actions/get-SubSubCat_Name';
import { getTranslations } from 'next-intl/server';
import ProductBySubSubCategoryPage from './subSubDriversClient';

type Props = {
  params: { lang?: string, driversSubCategory?: string, driversSeries?: string, driversSubSubCategory?: string }
}

export default async function ProductBySubSubCategoryPageJsonLd({params}: Props) {
  const { lang = 'id', driversSubCategory = '', driversSeries = '', driversSubSubCategory = '' } = params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const [subCatNameResult, seriesNameResult, subSubCatNameResult] = await Promise.allSettled([
    getSubCatNameBySlug(driversSubCategory),
    getSeriesNameBySlug(driversSeries),
    getSubSubCatNameBySlug(driversSubSubCategory),
  ]);

  const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
  const seriesName = seriesNameResult.status === 'fulfilled' ? seriesNameResult.value : { name: '' };
  const subSubCatName = subSubCatNameResult.status === 'fulfilled' ? subSubCatNameResult.value : { name: '' };
  const allprodserver = await getAllProductsBySubSubCategoryJsonld(driversSubCategory, driversSeries, driversSubSubCategory); // SSR fetch

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",    
    "url": lang === 'id' ? `${baseUrl}/driver/${driversSubCategory}/${driversSeries}/${driversSubSubCategory}` : `${baseUrl}/${lang}/drivers/${driversSubCategory}/${driversSeries}/${driversSubSubCategory}`, 
    "name": "ACR Speaker",
    "description": `${t('jsonLd-description-1')} ${subCatName?.name} ${seriesName?.name} ${subSubCatName?.name} ${t('jsonLd-description-2')}`,
    "itemListElement": allprodserver?.map((driver: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": lang === 'id' ? `${baseUrl}/produk/${driver.slug}` : `${baseUrl}/${lang}/products/${driver.slug}`,
        "name": driver.name,
        "description": driver.name,
        "image": `${baseUrl}${driver.coverUrl}`,
        "sku": driver.slug || driver.id,
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
      <h1 className='sr-only'>{subCatName.name} {seriesName.name} {subSubCatName.name} Series | ACR Speaker</h1>
      <h2 className='sr-only'>{t('h3 all product 1')} {subCatName.name} {seriesName.name} {subSubCatName.name} {t('h3 all product 2')}</h2>
      <ProductBySubSubCategoryPage params={params} />
    </>
  );
}

