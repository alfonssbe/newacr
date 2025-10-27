import getProduct from "@/app/actions/get-one-product";
import SingleProduct from "./pageClient";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ lang?: string, productSlug?: string }>
}

export default async function SingleProductJsonLd(props: Props) {
    const { lang = 'id', productSlug = '' } = await props.params;
    const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
    const data = await getProduct(productSlug, lang); // SSR fetch

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data?.name,
        "description": `${t('jsonLd-description-products')} ${data?.name}`,
        "image": data?.coverImg.url ? `${baseUrl}${data.coverImg.url}` : '',
        "sku": data?.slug || data?.id,
        "brand": {
          "@type": "Brand",
          "name": "ACR Speaker"
        },
        "url": 
          data?.slug ? 
            lang === 'id' ? 
              `${baseUrl}/produk/${data.slug}` 
              : 
              `${baseUrl}/${lang}/products/${data.slug}` 
            : 
            lang === 'id' ?
            `${baseUrl}`
            :
            `${baseUrl}/${lang}`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": lang === 'id' ? `${baseUrl}` : `${baseUrl}/${lang}`
        }
      };
    
    return(
        <>
            <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SingleProduct prod={data}/>
        </>
    );
}