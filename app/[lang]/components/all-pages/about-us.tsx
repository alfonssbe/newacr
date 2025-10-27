
import { LazyImage } from "@/app/[lang]/components/lazyImage";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/app/[lang]/components/ui/breadcrumb";

type Props = {
  params: { lang?: string };
};

export default async function AboutUs({ params }: Props) {
  const { lang = 'id' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const t_aboutus = await getTranslations({ locale: lang, namespace: 'About Us Page' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `${t('generateMetadata-title-about-us')} | ACR Speaker`,
    "url": lang === 'id' ? `${baseUrl}/tentang-kami` : `${baseUrl}/${lang}/about-us`,
    "logo": `${baseUrl}/images/acr/logo_acr.webp`,
  };

  return (
    <div className="bg-background -z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <h1 className="sr-only">{t('generateMetadata-title-about-us')} | ACR Speaker</h1>
            <div className="container mx-auto xl:px-24 lg:px-16 px-10 xl:pt-8 pt-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href={lang === 'id' ? '/' : `/${lang}`}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>{t_aboutus('about-us-title')}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
      <div className="relative w-full container mx-auto xl:px-24 lg:px-16 px-10 pb-4 pt-10 h-fit">
        <div className='pb-4'>
          <div className='text-4xl font-bold text-black pb-4'>
            {t_aboutus('about-us-title')}
          </div>
          <Separator className='bg-primary w-56 h-2'/>
        </div>
        <div className="pb-4 md:grid md:grid-cols-2">
          <div className="md:pl-4 md:pb-0 pb-4 flex items-center md:order-2 order-1">
            <LazyImage src={'/images/acr/SBE_Baru.webp'} alt="Sinar Baja Electric Facility" width={1000} height={1000}/>
          </div>

          <div className="pr-4 md:order-1 order-2">
            <h2 className="font-bold text-black pb-8 text-3xl">
              {t_aboutus.rich('about-us-title-heading', {
                b: (chunks) => <b>{chunks}</b>,
                i: (chunks) => <i>{chunks}</i>,
              })}
            </h2>
            <h3 className="text-black pb-4 text-justify">
              {t_aboutus.rich('about-us-desc-1', {
                b: (chunks) => <b>{chunks}</b>,
                i: (chunks) => <i>{chunks}</i>,
              })}
            </h3>
            <h3 className="text-black pb-4 text-justify">
              {t_aboutus.rich('about-us-desc-2', {
                b: (chunks) => <b>{chunks}</b>,
                i: (chunks) => <i>{chunks}</i>,
              })}
            </h3>
            <h3 className="text-black pb-2 text-justify">
              {t_aboutus.rich('about-us-desc-3', {
                b: (chunks) => <b>{chunks}</b>,
                i: (chunks) => <i>{chunks}</i>,
              })}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}