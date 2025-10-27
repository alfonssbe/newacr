import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import {routing} from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import NextTopLoader from 'nextjs-toploader';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ScrollToTop from './components/scrollToTop';
import { allLocales } from '@/lib/gsp_var';

// export const revalidate = 86400
// export async function generateStaticParams() {
//   return allLocales.map((lang) => ({ lang }));
// }

const font = Inter({ subsets: ['cyrillic'] })

type Props = {
  params: Promise<{ lang?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang = 'id' } = await props.params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  return {
    title: {
      template: '%s | ACR Speaker',
      default: 'ACR Speaker | 100% Karya Anak Bangsa',
    },
    description: `${t('generateMetadata-description-home')}`,
    keywords: `ACR, ACR Speaker, 100% Karya Anak Bangsa, ${t('generateMetadata-keywords-1-home')}, ${t('generateMetadata-keywords-2-home')}`,
    openGraph: {
      title: 'ACR Speaker | 100% Karya Anak Bangsa',
      description: `${t('generateMetadata-description-home')}`,
      url: lang === 'id' ? `${baseUrl}` : `${baseUrl}/${lang}`,
      siteName: 'ACR Speaker',
      images: [
        {
          url: `${baseUrl}/images/acr/logo_acr.webp`,
          width: 1200,
          height: 630,
          alt: 'ACR Speaker Logo',
        },
        {
          url: `${baseUrl}/images/acr/logo_acr.webp`,
          width: 800,
          height: 800,
          alt: 'ACR Speaker Logo',
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ACR Speaker | 100% Karya Anak Bangsa',
      description: `${t('generateMetadata-description-home')}`,
      images: [
        {
          url: `${baseUrl}/images/acr/logo_acr.webp`,
          width: 800,
          height: 800,
          alt: 'ACR Speaker Logo',
        }
      ],
    },
    alternates: {
      canonical: lang === 'id' ? `${baseUrl}` : `${baseUrl}/${lang}`,
      languages: {
        'id': `${baseUrl}`,
        'en': `${baseUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    icons: {
      icon: `${baseUrl}/favicon.ico`,
      shortcut: `${baseUrl}/favicon.ico`,
      apple: `${baseUrl}/apple-touch-icon.png`,
    },
  }
}

export default async function RootUILayout({   
    children,
    params
  }: {
    children: React.ReactNode;
    params: Promise<{lang: string}>;
  }) {
    // Ensure that the incoming `locale` is valid
    const {lang} = await params;
    if (!hasLocale(routing.locales, lang)) {
      notFound();
    }

    const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-XYZ'
    return (
        <html lang={lang}>
          <body className={`${font.className || ''} overflow-x-hidden`}>
            <ScrollToTop />
            <NextIntlClientProvider>
            <div className='min-h-screen'>
              <NextTopLoader color='#ee3239' showSpinner={false}/>
                <div className="sticky top-0 z-50 bg-transparent bg-cover bg-center">
                  <Navbar />
                </div>
                <div className="flex flex-col min-h-screen">
                  <main className="grow">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
            </NextIntlClientProvider>
            <Toaster />
          </body>
         <GoogleAnalytics gaId={GA_ID} />
        </html>
    )
}
