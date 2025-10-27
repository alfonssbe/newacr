import { getTranslations } from 'next-intl/server';
import Hero from './components/homepage-components/Hero';
import Keunggulan from './components/homepage-components/keunggulan';
import NewProduct from './components/homepage-components/new_product';
import Series from './components/homepage-components/series';
import Contact from './components/homepage-components/contact';
import History from './components/homepage-components/History';
import News from './components/homepage-components/news';
import Youtube from './components/homepage-components/Youtube';
import Distributor from './components/homepage-components/distributor';
import HeroSection from './components/homepage-components/Hero';

type Props = {
  params: Promise<{ lang?: string }>;
};

export default async function LandingPageACR(props: Props) {  
  const { lang = 'id' } = await props.params;
  const t = await getTranslations({ locale: lang, namespace: 'Homepage' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ACR Speaker | 100% Karya Anak Bangsa",
    "url": lang === 'id' ? `${baseUrl}` : `${baseUrl}/${lang}`,
    "logo": `${baseUrl}/images/acr/logo_acr.webp`,
    "sameAs": [
      "https://www.instagram.com/acrspeaker/",
      "https://www.facebook.com/acrspeakers/",
    ]
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
        <h1 className='sr-only'>{t('Heading 1')}</h1>
      <HeroSection />
      <Keunggulan />
      <NewProduct />
      <Series />
      <Contact />
      <History />
      <News />
      <Youtube />
      <Distributor />
    </>
  );
}
