import { getTranslations } from "next-intl/server";
import ContactUs from "./contactClient";

type Props = {
  params: { lang?: string };
};

export default async function ContactUsJsonLd({ params }: Props) {
  const { lang = 'id' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `${t('generateMetadata-title-contact')} | ACR Speaker`,
    "url": lang === 'id' ? `${baseUrl}/kontak` : `${baseUrl}/${lang}/contact`,
    "logo": `${baseUrl}/images/acr/logo_acr.webp`,
    "description": `${t('generateMetadata-description-contact')}`,
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+62 31 748 0011",
        "contactType": `${t('generateMetadata-keywords-contact-main-office')}`
      },
      {
        "@type": "ContactPoint",
        "telephone": ["+62 81 231 833 504", "+62 81 217 334 084"],
        "contactType": "Showroom Surabaya"
      },
      {
        "@type": "ContactPoint",
        "telephone": ["+62 21 649 3139", "+62 811 3077 6724"],
        "contactType": "Showroom Jakarta"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">{t('generateMetadata-title-contact')} | ACR Speaker</h1>
      <ContactUs />
    </>
  );
}