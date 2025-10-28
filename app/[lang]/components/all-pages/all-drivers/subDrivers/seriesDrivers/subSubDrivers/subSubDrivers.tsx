import getSeriesNameBySlug from '@/app/actions/get-Series_Name';
import getSubCatNameBySlug from '@/app/actions/get-SubCat_Name';
import getSubSubCatNameBySlug from '@/app/actions/get-SubSubCat_Name';
import { getTranslations } from 'next-intl/server';
import ProductBySubSubCategoryPage from './subSubDriversClient';
import { AllProductsJsonType } from '@/app/types';
import getAllProductsJsonld from '@/app/actions/jsonLd/get-all-products-jsonld';

type Props = {
  params: { lang?: string, driverCategory?: string, driversSubCategory?: string, driversSeries?: string, driversSubSubCategory?: string }
}

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS_JSON_BY_SUB_SUB_CATEGORY}`;

export default async function ProductBySubSubCategoryPageJsonLd({params}: Props) {
  const { lang = 'id', driverCategory = '', driversSubCategory = '', driversSeries = '', driversSubSubCategory = '' } = params
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
  const API_EDITED_FIRST = API.replace('{productSubCategory}', driversSubCategory)
  const API_EDITED_SECOND = API_EDITED_FIRST.replace('{productSeries}', driversSeries)
  const API_EDITED_NOTFIX = API_EDITED_SECOND.replace('{productSubSubCategory}', driversSubSubCategory)
  const API_EDITED = API_EDITED_NOTFIX.replace('{productCategory}', driverCategory)
  const allprodserver : AllProductsJsonType[] = await getAllProductsJsonld(API_EDITED); // SSR fetch

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",    
    "url": lang === 'id' ? `${baseUrl}/${driverCategory}/${driversSubCategory}/${driversSeries}/${driversSubSubCategory}` : `${baseUrl}/${lang}/${driverCategory}/${driversSubCategory}/${driversSeries}/${driversSubSubCategory}`, 
    "name": "ACR Speaker",
    "description": `${t('jsonLd-description-1')} ${subCatName?.name} ${seriesName?.name} ${subSubCatName?.name} ${t('jsonLd-description-2')}`,
    "itemListElement": allprodserver?.map((driver, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": lang === 'id' ? `${baseUrl}/produk/${driver.slug}` : `${baseUrl}/${lang}/products/${driver.slug}`,
        "name": driver.name,
        "description": driver.name,
        "image": `${baseUrl}${driver.cover_img.url}`,
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

