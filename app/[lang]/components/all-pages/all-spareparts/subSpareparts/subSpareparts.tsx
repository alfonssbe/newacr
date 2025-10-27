import getSubCatNameBySlug from "@/app/actions/get-SubCat_Name";
import { getTranslations } from "next-intl/server";
import getAllSparepartBySubCategoryJsonld from "@/app/actions/jsonLd/get-all-sparepart-by-sub-category-jsonld";
import SparepartBySubCategoryPage from "./subSparepartsClient";

type Props = {
  params: { lang?: string, sparepartSubCategory?: string }
}

export default async function SparepartBySubCategoryPageJsonLd({params}: Props) {    
  const { lang = 'id', sparepartSubCategory = '' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const [subCatNameResult] = await Promise.allSettled([
    getSubCatNameBySlug(sparepartSubCategory),
  ]);

  const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
  const allsparepartserver = await getAllSparepartBySubCategoryJsonld(sparepartSubCategory); // SSR fetch

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": lang === 'id' ? `${baseUrl}/sparepart/${sparepartSubCategory}` : `${baseUrl}/${lang}/spareparts/${sparepartSubCategory}`, 
    "name": "ACR Speaker",
    "description": `${t('jsonLd-description-1')} ${subCatName?.name} Spareparts ${t('jsonLd-description-2')}`,
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
      <h1 className='sr-only'>{subCatName.name} Spareparts Series | ACR Speaker</h1>
      <h2 className='sr-only'>{t('h3 all product 1')} {subCatName.name} Spareparts {t('h3 all product 2')}</h2>
      <SparepartBySubCategoryPage params={params}/>
    </>
  );
}