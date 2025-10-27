import getSingleMetadata from "@/app/actions/get-metadata-single-product";
import { Metadata } from "next"
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ lang?: string, productSlug?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang = 'id', productSlug = '' } = await props.params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
   const [productResult] = await Promise.allSettled([
    getSingleMetadata(productSlug, lang),
  ]);

  const product = productResult.status === 'fulfilled' ? productResult.value : { id: '', name: '', desc: '', slug: '', coverUrl: '', coverAlt: '', size: {value: '', label: ''} };

  return {
    title: `${product.name} - ACR Speaker | 100% Karya Anak Bangsa`,
    description: `${t('generateMetadata-description-products')} ${product.name}!`,
    applicationName: 'ACR Speaker',
    keywords: [
      product.name,
      product.slug,
      `${product.size.value}" driver`,
      `${product.size.value} inch driver`
    ],
    openGraph: {
      title: `${product.name} - ACR Speaker | 100% Karya Anak Bangsa`,
      description: `${t('generateMetadata-description-products')} ${product.name}!`,
      url: lang === 'id' ? `${baseUrl}/produk/${product.slug}` : `${baseUrl}/${lang}/products/${product.slug}`,
      siteName: "ACR Speaker",
      images: [
        {
          url: `${baseUrl}${product.coverUrl}`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - ACR Speaker | 100% Karya Anak Bangsa`,
      description: `${t('generateMetadata-description-products')} ${product.name}!`,
      images: [
        {
          url: `${baseUrl}${product.coverUrl}`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: lang === 'id' ? `${baseUrl}/produk/${product.slug}` : `${baseUrl}/${lang}/products/${product.slug}`,
      languages: {
        'id': `${baseUrl}/produk/${product.slug}`,
        'en': `${baseUrl}/en/products/${product.slug}`,
      },
    },
  }
}


export default function SingleProductLayout({
    children,
  }: {
    children: React.ReactNode
  }
)
{
  return(
    <>
      {children}
    </>
  )
  }