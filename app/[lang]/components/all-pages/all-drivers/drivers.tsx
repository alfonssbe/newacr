import getAllProductsJsonld from "@/app/actions/jsonLd/get-all-products-jsonld";
import { getTranslations } from "next-intl/server";
import ProductByCategoryPage from "./driversClient";
import { AllProductsJsonType } from "@/app/types";

type Props = {
  params: { lang?: string };
};

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS_JSON}`;

export default async function ProductByCategoryPageJsonLd({ params }: Props) {
  const { lang = 'id' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const allprodserver : AllProductsJsonType[] = await getAllProductsJsonld(API);
  console.log(allprodserver)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": lang === 'id' ? `${baseUrl}/driver` : `${baseUrl}/${lang}/drivers`,
    "name": "ACR Speaker",
    "description": `${t('generateMetadata-description-alldrivers')}`,
    "itemListElement": allprodserver && allprodserver.map((driver: AllProductsJsonType, index) => ({
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
        <ProductByCategoryPage/>
    </>
  );
}

