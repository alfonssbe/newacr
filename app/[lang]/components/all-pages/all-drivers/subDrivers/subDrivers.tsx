import getSubCatNameBySlug from "@/app/actions/get-SubCat_Name";
import { getTranslations } from "next-intl/server";
import ProductBySubCategoryPage from "./subDriversClient";
import getAllProductsJsonld from "@/app/actions/jsonLd/get-all-products-jsonld";
import { AllProductsJsonType } from "@/app/types";

type Props = {
  params: { lang?: string, driversSubCategory?: string }
}

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS_JSON_BY_SUB_CATEGORY}`;

export default async function ProductBySubCategoryPageJsonLd({params}: Props) {    
  const { lang = 'id', driversSubCategory = '' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const API_EDITED = API.replace('{productSubCategory}', driversSubCategory)
  const [subCatNameResult] = await Promise.allSettled([
    getSubCatNameBySlug(driversSubCategory),
  ]);

  const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
  const allprodserver : AllProductsJsonType[] = await getAllProductsJsonld(API_EDITED); // SSR fetch

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": lang === 'id' ? `${baseUrl}/driver/${driversSubCategory}` : `${baseUrl}/${lang}/drivers/${driversSubCategory}`, 
    "name": "ACR Speaker",
    "description": `${t('jsonLd-description-1')} ${subCatName?.name} ${t('jsonLd-description-2')}`,
    "itemListElement": allprodserver?.map((driver: AllProductsJsonType, index: number) => ({
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
      <h1 className='sr-only'>{subCatName.name} Series | ACR Speaker</h1>
      <h2 className='sr-only'>{t('h3 all product 1')} {subCatName.name} {t('h3 all product 2')}</h2>
      <ProductBySubCategoryPage params={params}/>
    </>
  );
}