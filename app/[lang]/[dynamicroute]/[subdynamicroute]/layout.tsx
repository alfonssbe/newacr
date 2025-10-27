import getOneNews from "@/app/actions/get-one-news";
import getSubCatNameBySlug from "@/app/actions/get-SubCat_Name";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SingleNewsLayout from "../../components/all-layout/single-news/single-news-layout";
import AllSubDriversLayout from "../../components/all-layout/all-drivers/subDrivers/subDriversLayout";
import SparepartBySubCategoryLayout from "../../components/all-layout/all-spareparts/subSpareparts/subSparepartsLayout";
import NotFound from "../../components/all-pages/not-found";
import getAllProductsGSP from "@/app/actions/get-all-products-for-gsp";
import getAllNewsGSP from "@/app/actions/get-all-news-for-gsp";
import { allLocalesSubDrivers } from "@/lib/gsp_var";

// export const revalidate = 86400
// export async function generateStaticParams() {
//   const [allnewsId, allnewsEn] = await getAllNewsGSP();
//   const allProducts = await getAllProductsGSP();

//   if (!allProducts || allProducts.length === 0) {
//     return []; // no params generated
//   }

//   const allNewsIdFinal = allnewsId.map((val) => ["id", "berita", val]);
//   const allNewsEnFinal = allnewsEn.map((val) => ["en", "news", val]);

//   const allDriversFinal = allProducts.flatMap((val) => [
//       //@ts-ignore
//       ["id", "produk", val.slug] as const,
//       //@ts-ignore
//       ["en", "products", val.slug] as const,
//   ]);

//   const finalData = [
//       ...allLocalesSubDrivers,
//       ...allNewsIdFinal,
//       ...allNewsEnFinal,
//       ...allDriversFinal,
//   ];

//   return finalData.map(([lang, dynamicroute, subdynamicroute]) => ({
//     lang,
//     dynamicroute,
//     subdynamicroute,
//   }));
// }

type Props = {
  params: Promise<{ lang?: string, dynamicroute: string, subdynamicroute: string }>
}

function stripHtmlAndTruncate(html: string, wordLimit: number = 30): string {
  // Remove HTML tags and decode entities
  const plainText = html.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ").trim();
  // Split into words and truncate
  const words = plainText.split(/\s+/);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : plainText;
}
 
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang = 'id', dynamicroute: slug, subdynamicroute: subslug } = await props.params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';

  const logo_URL = `${baseUrl}/images/acr/logo_acr.webp`
   switch (slug) {
    case 'news':
    case 'berita':{
        const news = await getOneNews(subslug, lang)

        // let previousImagesNews = (await parent).openGraph?.images || []
        const truncatedDescription = stripHtmlAndTruncate(news.description, 30);
        return {
            title: `${news.title} | ACR Speaker`,
            description: truncatedDescription,
            applicationName: 'ACR Speaker',
            keywords: [
            news.title,
            news.slug,
            `${t('generateMetadata-keywords-news')}`
            ],
            openGraph: {
            title: `${news.title} | ACR Speaker`,
            description: truncatedDescription,
            url: lang === 'id' ? `${baseUrl}/berita/${news.slug}` : `${baseUrl}/${lang}/news/${news.slug}`,
            siteName: "ACR Speaker",
            images: [
                {
                url: `${baseUrl}${news.news_img_url}`,
                width: 800,
                height: 800,
                alt: news.title,
                },
                // ...previousImagesNews,
            ],
            type: "article",
            publishedTime: news.event_date.toString(), 
            },
            twitter: {
            card: "summary_large_image",
            title: `${news.title} | ACR Speaker`,
            description: truncatedDescription,
            images: [    
                {
                url: `${baseUrl}${news.news_img_url}`,
                width: 800,
                height: 800,
                alt: news.title,
                },
            ],
            },
            alternates: {
            canonical: lang === 'id' ? `${baseUrl}/berita/${news.slug}` : `${baseUrl}/${lang}/news/${news.slug}`,
            languages: {
                'id': `${baseUrl}/berita/${news.slug}`,
                'en': `${baseUrl}/en/news/${news.slug}`,
            },
            },
        }
      }
    case 'drivers':
    case 'driver':{
        const [subCatNameResult] = await Promise.allSettled([
            getSubCatNameBySlug(subslug),
        ]);

        const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
        // let previousImagesDrivers = (await parent).openGraph?.images || []
        const logo_URL = subslug === 'acr' ? `${baseUrl}/images/acr/logo_acr.webp` : subslug === 'desibel' ? `${baseUrl}/images/acr/desibel_logo.webp` : subslug === 'curve' ? `${baseUrl}/images/acr/curve_logo.webp` : `${baseUrl}/images/acr/logo_acr.webp`

        return {
            title: `${subCatName.name} Series | ACR Speaker`,
            description: `${t('generateMetadata-description-1')} ${subCatName.name} ${t('generateMetadata-description-2')}`,
            applicationName: 'ACR Speaker',
            keywords: [`${subCatName.name}`, `${subCatName.name} ${t('generateMetadata-keywords')} ACR Speaker`],
            openGraph: {
            title: `${subCatName.name} | ACR Speaker`,
            description: `${t('generateMetadata-description-1')} ${subCatName.name} ${t('generateMetadata-description-2')}`,
            url: lang === 'id' ? `${baseUrl}/driver/${subslug}` : `${baseUrl}/${lang}/drivers/${subslug}`,
            siteName: "ACR Speaker",
            images: [
                // {
                //   url: logo_URL,
                //   width: 1200,
                //   height: 630,
                //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
                // },
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `${subCatName.name} Logo`,
                },
                // ...previousImagesDrivers,
            ],
            locale: lang === 'id' ? 'id_ID' : 'en_US',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: `${subCatName.name} | ACR Speaker`,
            description: `${t('generateMetadata-description-1')} ${subCatName.name} ${t('generateMetadata-description-2')}`,
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `${subCatName.name} Logo`,
                },
            ],
            },
            alternates: {
            canonical: lang === 'id' ? `${baseUrl}/driver/${subslug}` : `${baseUrl}/${lang}/drivers/${subslug}`,
            languages: {
                'id': `${baseUrl}/driver/${subslug}`,
                'en': `${baseUrl}/en/drivers/${subslug}`,
            },
            },
        }
      }
    case 'spareparts':
    case 'sparepart':{
      const [subCatNameResult] = await Promise.allSettled([
        getSubCatNameBySlug(subslug),
      ]);

      const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
      // const previousImages = (await parent).openGraph?.images || []
      const logo_URL = subslug === 'acr' ? `${baseUrl}/images/acr/logo_acr.webp` : subslug === 'desibel' ? `${baseUrl}/images/acr/desibel_logo.webp` : subslug === 'curve' ? `${baseUrl}/images/acr/curve_logo.webp` : `${baseUrl}/images/acr/logo_acr.webp`

      return {
        title: `${subCatName.name} Spareparts Series | ACR Speaker`,
        description: `${t('generateMetadata-description-1')} ${subCatName.name} Spareparts ${t('generateMetadata-description-2')}`,
        applicationName: 'ACR Speaker',
        keywords: [`${subCatName.name} Spareparts`, `${subCatName.name} Spareparts ${t('generateMetadata-keywords')} ACR Speaker`],
        openGraph: {
          title: `${subCatName.name} Spareparts | ACR Speaker`,
          description: `${t('generateMetadata-description-1')} ${subCatName.name} Spareparts ${t('generateMetadata-description-2')}`,
          url: lang === 'id' ? `${baseUrl}/sparepart/${subslug}` : `${baseUrl}/${lang}/spareparts/${subslug}`,
          siteName: "ACR Speaker",
          images: [
            // {
            //   url: logo_URL,
            //   width: 1200,
            //   height: 630,
            //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
            // },
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: `${subCatName.name} Logo`,
            },
            // ...previousImages,
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${subCatName.name} Spareparts | ACR Speaker`,
          description: `${t('generateMetadata-description-1')} ${subCatName.name} Spareparts ${t('generateMetadata-description-2')}`,
          images: [
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: `${subCatName.name} Logo`,
            },
          ],
        },
        alternates: {
          canonical: lang === 'id' ? `${baseUrl}/sparepart/${subslug}` : `${baseUrl}/${lang}/spareparts/${subslug}`,
          languages: {
            'id': `${baseUrl}/sparepart/${subslug}`,
            'en': `${baseUrl}/en/spareparts/${subslug}`,
          },
        },
      }
    }
    // case 'products':
    // case 'produk':{
    //   const [productResult] = await Promise.allSettled([
    //     getSingleMetadata(subslug, lang),
    //   ]);

    //   const product = productResult.status === 'fulfilled' ? productResult.value : { id: '', name: '', desc: '', slug: '', coverUrl: '', coverAlt: '', size: {value: '', label: ''} };
    //   // const previousImages = (await parent).openGraph?.images || []

    //   return {
    //     title: `${product.name} | ACR Speaker`,
    //     description: `${t('generateMetadata-description-products')} ${product.name}!`,
    //     applicationName: 'ACR Speaker',
    //     keywords: [
    //       product.name,
    //       product.slug,
    //       `${product.size.value}" driver`,
    //       `${product.size.value} inch driver`
    //     ],
    //     openGraph: {
    //       title: `${product.name} | ACR Speaker`,
    //       description: `${t('generateMetadata-description-products')} ${product.name}!`,
    //       url: lang === 'id' ? `${baseUrl}/produk/${product.slug}` : `${baseUrl}/${lang}/products/${product.slug}`,
    //       siteName: "ACR Speaker",
    //       images: [
    //         {
    //           url: `${baseUrl}${product.coverUrl}`,
    //           width: 800,
    //           height: 800,
    //           alt: product.name,
    //         },
    //         // ...previousImages,
    //       ],
    //       locale: lang === 'id' ? 'id_ID' : 'en_US',
    //       type: "website",
    //     },
    //     twitter: {
    //       card: "summary_large_image",
    //       title: `${product.name} | ACR Speaker`,
    //       description: `${t('generateMetadata-description-products')} ${product.name}!`,
    //       images: [
    //         {
    //           url: `${baseUrl}${product.coverUrl}`,
    //           width: 800,
    //           height: 800,
    //           alt: product.name,
    //         },
    //       ],
    //     },
    //     alternates: {
    //       canonical: lang === 'id' ? `${baseUrl}/produk/${product.slug}` : `${baseUrl}/${lang}/products/${product.slug}`,
    //       languages: {
    //         'id': `${baseUrl}/produk/${product.slug}`,
    //         'en': `${baseUrl}/en/products/${product.slug}`,
    //       },
    //     },
    //   }
    // }
    default:
      return {
        title: 'ACR Speaker | 100% Karya Anak Bangsa',
        description: `${t('generateMetadata-description-home')}`,
      };
  }
}

export default async function RouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string; dynamicroute: string }>; 
}) {
  const { dynamicroute: slug } = await params; 
  switch (slug) {
    case 'news':
    case 'berita':
      return <SingleNewsLayout>{children}</SingleNewsLayout>;
    case 'drivers':
    case 'driver':
      return <AllSubDriversLayout>{children}</AllSubDriversLayout>;
    case 'spareparts':
    case 'sparepart':
      return <SparepartBySubCategoryLayout>{children}</SparepartBySubCategoryLayout>;
    // case 'products':
    // case 'produk':
    //   return <AllProductLayout><SingleProductLayout>{children}</SingleProductLayout></AllProductLayout>;
    default:
      return <NotFound />
  }
}