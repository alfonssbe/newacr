import { getTranslations } from "next-intl/server";
import getAllSparepartJsonld from "@/app/actions/jsonLd/get-all-sparepart-jsonld";
import SparepartByCategoryPage from "./sparepartsClient";

type Props = {
  params: { lang?: string };
};

export default async function SparepartByCategoryPageJsonLd({ params }: Props) {
  const { lang = 'id' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  const allsparepartserver = await getAllSparepartJsonld(); // SSR fetc

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": lang === 'id' ? `${baseUrl}/sparepart` : `${baseUrl}/${lang}/spareparts`,
    "name": "ACR Speaker",
    "description": `${t('generateMetadata-description-allsparepart')}`,
    "itemListElement": allsparepartserver?.map((sparepart: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": lang === 'id' ? `${baseUrl}/produk/${sparepart.slug}` : `${baseUrl}/${lang}/products/${sparepart.slug}`,
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
        <SparepartByCategoryPage/>
    </>
  );
}

