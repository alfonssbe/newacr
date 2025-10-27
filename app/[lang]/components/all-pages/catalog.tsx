import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/app/[lang]/components/ui/breadcrumb";
import PDFViewer from "../flipbook";
type Props = {
  params: { lang?: string };
};

export default async function Catalog({ params }: Props) {
  const { lang = 'id' } = params;
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  const t_catalog = await getTranslations({ locale: lang, namespace: 'Catalogue Page' });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3002';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `${t('generateMetadata-title-catalog')} | ACR Speaker`,
    "url": lang === 'id' ? `${baseUrl}/katalog` : `${baseUrl}/${lang}/catalogues`,
    "logo": `${baseUrl}/images/acr/logo_acr.webp`,
  };

  return (
    <div className="bg-background -z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <h1 className="sr-only">{t('generateMetadata-title-catalog')} | ACR Speaker</h1>
        
        <div className="container mx-auto xl:px-24 lg:px-16 px-10 xl:pt-8 pt-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href={lang === 'id' ? '/' : `/${lang}`}>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>{t_catalog('catalogue-title')}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    <div className="relative w-full container mx-auto xl:px-24 lg:px-16 px-10 pb-8 pt-10 h-fit">
      <div className='pb-8'>
        <div className='text-4xl font-bold text-black pb-4'>
          {t_catalog('catalogue-title')}
        </div>
        <Separator className='bg-primary w-56 h-2'/>
      </div>







    </div>
      <PDFViewer/>
    </div>
  );
}