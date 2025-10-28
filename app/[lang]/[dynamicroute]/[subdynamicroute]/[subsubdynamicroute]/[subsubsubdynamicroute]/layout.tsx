import getSubCatNameBySlug from "@/app/actions/get-SubCat_Name";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import getSeriesNameBySlug from "@/app/actions/get-Series_Name";
import getSubSubCatNameBySlug from "@/app/actions/get-SubSubCat_Name";
import ProductBySubSubCatLayout from "@/app/[lang]/components/all-layout/all-drivers/subDrivers/seriesDrivers/subSubDrivers/subSubDriversLayout";
import NotFound from "@/app/[lang]/components/all-pages/not-found";

// export const revalidate = 86400
// export async function generateStaticParams() {
//   return allLocalesSubSubSubDrivers.slice(0, 10).map(([lang, dynamicroute, subdynamicroute, subsubdynamicroute, subsubsubdynamicroute]) => ({
//     lang,
//     dynamicroute,
//     subdynamicroute,
//     subsubdynamicroute,
//     subsubsubdynamicroute
//   }));
// }

type Props = {
  params: Promise<{ lang?: string, dynamicroute: string, subdynamicroute: string, subsubdynamicroute: string, subsubsubdynamicroute: string }>
}
 
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang = 'id', dynamicroute: slug, subdynamicroute: subslug, subsubdynamicroute: subsubseries, subsubsubdynamicroute: subsubsubslug } = await props.params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';

  const logo_URL = `${baseUrl}/images/acr/logo_acr.webp`

   switch (slug) {
    case 'drivers':
    case 'driver':{
        const [subCatNameResult, seriesNameResult, subSubCatNameResult] = await Promise.allSettled([
          getSubCatNameBySlug(subslug),
          getSeriesNameBySlug(subsubseries),
          getSubSubCatNameBySlug(subsubsubslug),
        ]);

        const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
        const seriesName = seriesNameResult.status === 'fulfilled' ? seriesNameResult.value : { name: '' };
        const subSubCatName = subSubCatNameResult.status === 'fulfilled' ? subSubCatNameResult.value : { name: '' };
        const logo_URL = subslug === 'acr' ? `${baseUrl}/images/acr/logo_acr.webp` : subslug === 'desibel' ? `${baseUrl}/images/acr/desibel_logo.webp` : subslug === 'curve' ? `${baseUrl}/images/acr/curve_logo.webp` : `${baseUrl}/images/acr/logo_acr.webp`

        return {
          title: `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Series | ACR Speaker`,
          description: `${t('generateMetadata-description-1')} ${subCatName.name} ${seriesName.name} ${subSubCatName.name} ${t('generateMetadata-description-2')}`,
          applicationName: 'ACR Speaker',
          keywords: [`${subCatName.name} ${seriesName.name} ${subSubCatName.name} Series`, `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Series ${t('generateMetadata-keywords')} ACR Speaker`],
          openGraph: {
            title: `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Series | ACR Speaker`,
            description: `${t('generateMetadata-description-1')} ${subCatName.name} ${seriesName.name} ${subSubCatName.name} ${t('generateMetadata-description-2')}`,
            url: lang === 'id' ? `${baseUrl}/driver/${subslug}/${subsubseries}/${subsubsubslug}` : `${baseUrl}/${lang}/drivers/${subslug}/${subsubseries}/${subsubsubslug}`,
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
            ],
            locale: lang === 'id' ? 'id_ID' : 'en_US',
            type: "website",
          },
          twitter: {
            card: "summary_large_image",
            title: `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Series | ACR Speaker`,
            description: `${t('generateMetadata-description-1')} ${subCatName.name} ${seriesName.name} ${subSubCatName.name} ${t('generateMetadata-description-2')}`,
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
            canonical: lang === 'id' ? `${baseUrl}/driver/${subslug}/${subsubseries}/${subsubsubslug}` : `${baseUrl}/${lang}/drivers/${subslug}/${subsubseries}/${subsubsubslug}`,
            languages: {
              'id': `${baseUrl}/driver/${subslug}/${subsubseries}/${subsubsubslug}`,
              'en': `${baseUrl}/en/drivers/${subslug}/${subsubseries}/${subsubsubslug}`,
            },
          },
        }
      }
    case 'spareparts':
    case 'sparepart':{
      const [subCatNameResult, seriesNameResult, subSubCatNameResult] = await Promise.allSettled([
        getSubCatNameBySlug(subslug),
        getSeriesNameBySlug(subsubseries),
        getSubSubCatNameBySlug(subsubsubslug),
      ]);

      const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
      const seriesName = seriesNameResult.status === 'fulfilled' ? seriesNameResult.value : { name: '' };
      const subSubCatName = subSubCatNameResult.status === 'fulfilled' ? subSubCatNameResult.value : { name: '' };
      const logo_URL = subslug === 'acr' ? `${baseUrl}/images/acr/logo_acr.webp` : subslug === 'desibel' ? `${baseUrl}/images/acr/desibel_logo.webp` : subslug === 'curve' ? `${baseUrl}/images/acr/curve_logo.webp` : `${baseUrl}/images/acr/logo_acr.webp`

      return {
        title: `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts Series | ACR Speaker`,
        description: `${t('generateMetadata-description-1')} ${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts ${t('generateMetadata-description-2')}`,
        applicationName: 'ACR Speaker',
        keywords: [`${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts Series`, `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts Series ${t('generateMetadata-keywords')} ACR Speaker`],
        openGraph: {
          title: `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts Series | ACR Speaker`,
          description: `${t('generateMetadata-description-1')} ${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts ${t('generateMetadata-description-2')}`,
          url: lang === 'id' ? `${baseUrl}/sparepart/${subslug}/${subsubseries}/${subsubsubslug}` : `${baseUrl}/${lang}/spareparts/${subslug}/${subsubseries}/${subsubsubslug}`,
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
          ],
          locale: lang === 'id' ? 'id_ID' : 'en_US',
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts Series | ACR Speaker`,
          description: `${t('generateMetadata-description-1')} ${subCatName.name} ${seriesName.name} ${subSubCatName.name} Spareparts ${t('generateMetadata-description-2')}`,
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
          canonical: lang === 'id' ? `${baseUrl}/sparepart/${subslug}/${subsubseries}/${subsubsubslug}` : `${baseUrl}/${lang}/spareparts/${subslug}/${subsubseries}/${subsubsubslug}`,
          languages: {
            'id': `${baseUrl}/sparepart/${subslug}/${subsubseries}/${subsubsubslug}`,
            'en': `${baseUrl}/en/spareparts/${subslug}/${subsubseries}/${subsubsubslug}`,
          },
        },
      }
    }
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
    case 'drivers':
    case 'driver':
    case 'spareparts':
    case 'sparepart':
      return <ProductBySubSubCatLayout>{children}</ProductBySubSubCatLayout>;
    default:
      return <NotFound/>
  }
}