import AboutUsLayout from "../components/all-layout/about-us-layout";
import CatalogLayout from "../components/all-layout/catalog-layout";
import ContactUsLayout from "../components/all-layout/contact-layout";
import ComparisonLayout from "../components/all-layout/comparison-layout";
import DistributorsLayout from "../components/all-layout/distributors-layout";
import NewsLayout from "../components/all-layout/all-news-layout";
import AllProductLayout from "../components/all-layout/all-product-layout";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AllDriversLayout from "../components/all-layout/all-drivers/driversLayout";
import AllSparepartLayout from "../components/all-layout/all-spareparts/sparepartsLayout";
import NotFound from "../components/all-pages/not-found";
import { allLocalesRoutes } from "@/lib/gsp_var";

// export const revalidate = 86400
// export async function generateStaticParams() {
//   return allLocalesRoutes.map(([lang, dynamicroute]) => ({
//     lang,
//     dynamicroute,
//   }));
// }

type Props = {
  params: Promise<{ lang?: string, dynamicroute: string  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang = 'id', dynamicroute: slug } = await props.params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';

  const logo_URL = `${baseUrl}/images/acr/logo_acr.webp`

   switch (slug) {
    case 'about':
    case 'about-us':
    case 'tentang-kami':
      return {
        title: `${t('generateMetadata-title-about-us')}`,
        description: `${t('generateMetadata-description-about-us')}`,
        keywords: `${t('generateMetadata-title-about-us')}, ${t('generateMetadata-description-about-us')}, ${t('generateMetadata-keywords-about-us')}`,
        openGraph: {
          title: `${t('generateMetadata-title-about-us')} | ACR Speaker`,
          description: `${t('generateMetadata-description-about-us')}`,
          url: lang === 'id' ? `${baseUrl}/tentang-kami` : `${baseUrl}/${lang}/about-us`,
          siteName: 'ACR Speaker',
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            },
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: 'ACR Speaker Logo',
            },
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${t('generateMetadata-title-about-us')} | ACR Speaker`,
          description: `${t('generateMetadata-description-about-us')}`,
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            }
          ],
        },
        alternates: {
          canonical: lang === 'id' ? `${baseUrl}/tentang-kami` : `${baseUrl}/${lang}/about-us`,
          languages: {
            'id': `${baseUrl}/tentang-kami`,
            'en': `${baseUrl}/en/about-us`,
          },
        },
      };
    case 'catalog':
    case 'katalog':
      return {
        title: `${t('generateMetadata-title-catalog')}`,
        description: `${t('generateMetadata-description-catalog')}`,
        keywords: `${t('generateMetadata-title-catalog')}, ${t('generateMetadata-keywords-catalog')}`,
        openGraph: {
          title: `${t('generateMetadata-title-catalog')} | ACR Speaker`,
          description: `${t('generateMetadata-description-catalog')}`,
          url: lang === 'id' ? `${baseUrl}/katalog` : `${baseUrl}/${lang}/catalogues`,
          siteName: 'ACR Speaker',
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            },
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: 'ACR Speaker Logo',
            },
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${t('generateMetadata-title-catalog')} | ACR Speaker`,
          description: `${t('generateMetadata-description-catalog')}`,
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            }
          ],
        },
        alternates: {
          canonical: lang === 'id' ? `${baseUrl}/katalog` : `${baseUrl}/${lang}/catalogues`,
          languages: {
            'id': `${baseUrl}/katalog`,
            'en': `${baseUrl}/en/catalogues`,
          },
        },
      }
    case 'contact':
    case 'kontak':
      return {
        title: `${t('generateMetadata-title-contact')}`,
        description: `${t('generateMetadata-description-contact')}`,
        keywords: `${t('generateMetadata-title-contact')}, ${t('generateMetadata-keywords-contact')}`,
        openGraph: {
          title: `${t('generateMetadata-title-contact')} | ACR Speaker`,
          description: `${t('generateMetadata-description-contact')}`,
          url: lang === 'id' ? `${baseUrl}/kontak` : `${baseUrl}/${lang}/contact`,
          siteName: 'ACR Speaker',
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            },
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: 'ACR Speaker Logo',
            },
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${t('generateMetadata-title-contact')} | ACR Speaker`,
          description: `${t('generateMetadata-description-contact')}`,
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            }
          ],
        },
        alternates: {
          canonical: lang === 'id' ? `${baseUrl}/kontak` : `${baseUrl}/${lang}/contact`,
          languages: {
            'id': `${baseUrl}/kontak`,
            'en': `${baseUrl}/en/contact`,
          },
        },
      }
    case 'comparison':
    case 'komparasi':
        return {
          title: `${t('generateMetadata-title-comparison')}`,
          description: `${t('generateMetadata-description-comparison')}`,
          keywords: `${t('generateMetadata-title-comparison')}`,
          openGraph: {
            title: `${t('generateMetadata-title-comparison')} | ACR Speaker`,
            description: `${t('generateMetadata-description-comparison')}`,
            url: lang === 'id' ? `${baseUrl}/komparasi` : `${baseUrl}/${lang}/comparison`,
            siteName: 'ACR Speaker',
            images: [
              {
                url: logo_URL,
                width: 1200,
                height: 630,
                alt: 'ACR Speaker Logo',
              },
              {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: 'ACR Speaker Logo',
              },
            ],
            locale: lang === 'id' ? 'id_ID' : 'en_US',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: `${t('generateMetadata-title-comparison')} | ACR Speaker`,
            description: `${t('generateMetadata-description-comparison')}`,
            images: [
              {
                url: logo_URL,
                width: 1200,
                height: 630,
                alt: 'ACR Speaker Logo',
              }
            ],
          },
          alternates: {
            canonical: lang === 'id' ? `${baseUrl}/komparasi` : `${baseUrl}/${lang}/comparison`,
            languages: {
              'id': `${baseUrl}/komparasi`,
              'en': `${baseUrl}/en/comparison`,
            },
          },
        }
    case 'distributors':
    case 'distributor':
      return {
        title: `${t('generateMetadata-title-distributors')}`,
        description: `${t('generateMetadata-description-distributors')}`,
        keywords: `${t('generateMetadata-title-distributors')}, ${t('generateMetadata-keywords-distributors-surabaya')}, ${t('generateMetadata-keywords-distributors-jakarta')}, ${t('generateMetadata-keywords-distributors-malang')}, ${t('generateMetadata-keywords-distributors-bandung')}, ${t('generateMetadata-keywords-distributors-pati')}`,
        openGraph: {
          title: `${t('generateMetadata-title-distributors')} | ACR Speaker`,
          description: `${t('generateMetadata-description-distributors')}`,
          url: lang === 'id' ? `${baseUrl}/distributor` : `${baseUrl}/${lang}/distributors`,
          siteName: 'ACR Speaker',
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            },
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: 'ACR Speaker Logo',
            },
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${t('generateMetadata-title-distributors')} | ACR Speaker`,
          description: `${t('generateMetadata-description-distributors')}`,
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            }
          ],
        },
        alternates: {
          canonical: lang === 'id' ? `${baseUrl}/distributor` : `${baseUrl}/${lang}/distributors`,
          languages: {
            'id': `${baseUrl}/distributor`,
            'en': `${baseUrl}/en/distributors`,
          },
        },
      }
    case 'news':
    case 'berita':
      return {
        title: `${t('generateMetadata-title-news')}`,
        description: `${t('generateMetadata-description-news')}`,
        keywords: `${t('generateMetadata-title-news')}, ${t('generateMetadata-keywords-news')}`,
        openGraph: {
          title: `${t('generateMetadata-title-news')} | ACR Speaker`,
          description: `${t('generateMetadata-description-news')}`,
          url: lang === 'id' ? `${baseUrl}/berita` : `${baseUrl}/${lang}/news`,
          siteName: 'ACR Speaker',
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            },
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: 'ACR Speaker Logo',
            },
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${t('generateMetadata-title-news')} | ACR Speaker`,
          description: `${t('generateMetadata-description-news')}`,
          images: [
            {
              url: logo_URL,
              width: 1200,
              height: 630,
              alt: 'ACR Speaker Logo',
            }
          ],
        },
        alternates: {
          canonical: lang === 'id' ? `${baseUrl}/berita` : `${baseUrl}/${lang}/news`,
          languages: {
            'id': `${baseUrl}/berita`,
            'en': `${baseUrl}/en/news`,
          },
        },
      }
    case 'drivers':
    case 'driver':
      return {
        title: `${t('generateMetadata-title-alldrivers')}`,
        description: `${t('generateMetadata-description-alldrivers')}`,
        applicationName: 'ACR Speaker',
        keywords: ["ACR Speaker", `${t('generateMetadata-description-alldrivers')}`],
        openGraph: {
          title: `${t('generateMetadata-title-alldrivers')} | ACR Speaker`,
          description: `${t('generateMetadata-description-alldrivers')}`,
          url: lang === 'id' ? `${baseUrl}/driver` : `${baseUrl}/${lang}/drivers`,
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
              alt: `ACR Speaker Logo`,
            },
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${t('generateMetadata-title-alldrivers')} | ACR Speaker`,
          description: `${t('generateMetadata-description-alldrivers')}`,
          images: [
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: `ACR Speaker Logo`,
            },
          ],
        },
        alternates: {
          canonical: lang === 'id' ?  `${baseUrl}/driver` : `${baseUrl}/${lang}/drivers`,
          languages: {
            'id': `${baseUrl}/driver`,
            'en': `${baseUrl}/en/drivers`,
          },
        },
      }
    case 'spareparts':
    case 'sparepart':
      return {
        title: `${t('generateMetadata-title-allsparepart')}`,
        description: `${t('generateMetadata-description-allsparepart')}`,
        applicationName: 'ACR Speaker',
        keywords: ["ACR Speaker", `${t('generateMetadata-description-allsparepart')}`],
        openGraph: {
          title: `${t('generateMetadata-title-allsparepart')} | ACR Speaker`,
          description: `${t('generateMetadata-description-allsparepart')}`,
          url: lang === 'id' ? `${baseUrl}/sparepart` : `${baseUrl}/${lang}/spareparts`,
          siteName: "ACR Speaker",
          images: [
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: `ACR Speaker Logo`,
            },
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${t('generateMetadata-title-allsparepart')} | ACR Speaker`,
          description: `${t('generateMetadata-description-allsparepart')}`,
          images: [
            {
              url: logo_URL,
              width: 800,
              height: 800,
              alt: `ACR Speaker Logo`,
            },
          ],
        },
        alternates: {
          canonical: lang === 'id' ? `${baseUrl}/sparepart` : `${baseUrl}/${lang}/spareparts`,
          languages: {
            'id': `${baseUrl}/sparepart`,
            'en': `${baseUrl}/en/spareparts`,
          },
        },
      }
    default:
      return {
        title: t('generateMetadata-keywords-not-found-title'),
        description: t('generateMetadata-keywords-not-found-desc'),
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
    case 'about':
    case 'about-us':
    case 'tentang-kami':
      return <AboutUsLayout>{children}</AboutUsLayout>;
    case 'catalog':
    case 'katalog':
      return <CatalogLayout>{children}</CatalogLayout>;
    case 'contact':
    case 'kontak':
      return <ContactUsLayout>{children}</ContactUsLayout>;
    case 'comparison':
    case 'komparasi':
      return <ComparisonLayout>{children}</ComparisonLayout>;
    case 'distributors':
    case 'distributor':
      return <DistributorsLayout>{children}</DistributorsLayout>;
    case 'news':
    case 'berita':
      return <NewsLayout>{children}</NewsLayout>;
    case 'drivers':
    case 'driver':
      return <AllProductLayout><AllDriversLayout>{children}</AllDriversLayout></AllProductLayout>;
    case 'spareparts':
    case 'sparepart':
      return <AllProductLayout><AllSparepartLayout>{children}</AllSparepartLayout></AllProductLayout>;
    default:
      return <NotFound />
  }
}