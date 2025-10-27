"use client"

import { MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { LazyImageContact } from "@/app/[lang]/components/lazyImageContact";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/app/[lang]/components/ui/breadcrumb";

const allMapsUrl: string[] = [
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15831.555636353316!2d112.6804805!3d-7.2534827!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fe923ed24eeb%3A0x85682a2a3bd9cf3a!2sSinar%20Baja%20Electric%20Group!5e0!3m2!1sen!2sid!4v1728026193190!5m2!1sen!2sid",
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.842753394362!2d112.7403310912412!3d-7.258730476112531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96796683915%3A0x2ebf780f4f0b637c!2sJl.%20Genteng%20Besar%20No.15%2C%20Genteng%2C%20Kec.%20Genteng%2C%20Surabaya%2C%20Jawa%20Timur%2060275!5e0!3m2!1sen!2sid!4v1733792228029!5m2!1sen!2sid",
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.9097762192227!2d106.81405422498979!3d-6.142820643844167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f607717f29f7%3A0x93706dd52bf170b4!2sGlodok%20Plaza!5e0!3m2!1sen!2sid!4v1733792363701!5m2!1sen!2sid"
]

export default function ContactUs() {
  const [activeMapIndex, setActiveMapIndex] = useState<number>(0)
  const [_, setIsScrolling] = useState(false);
  const t = useTranslations("Contact Page");
  const locale = useLocale()
  const handleScrollToTop = () => {
    // Set isScrolling to true to disable pointer events
    setIsScrolling(true);

    // Start the smooth scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Check if scrolling has reached the top every 100ms
    const scrollCheck = setInterval(() => {
      if (window.scrollY === 0) {
        // When scroll position reaches the top, clear the interval and enable pointer events
        clearInterval(scrollCheck);
        setIsScrolling(false);
      }
    }, 100);
  };

  return (
    <>
    <div className="bg-white -z-10">
     <div className="map-container">
       <iframe src={allMapsUrl[activeMapIndex].startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allMapsUrl[activeMapIndex]}` : allMapsUrl[activeMapIndex]} width="100%" height="500" loading="lazy"></iframe>
    </div>
    <div className="container mx-auto xl:px-24 lg:px-16 px-10 xl:pt-8 pt-6">
          <Breadcrumb>
              <BreadcrumbList>
                  <BreadcrumbItem>
                  <BreadcrumbLink href={locale === 'id' ? '/' : `/${locale}`}>Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                  <BreadcrumbPage>{t('contact-title')}</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>
      </div>
    <div className="relative w-full container mx-auto xl:px-24 lg:px-16 px-10 pb-4 pt-10 h-fit flex justify-left">
    <div className='pb-4'>
        <div className='text-4xl font-bold text-black pb-4'>
          {t("contact-title")}
        </div>
        <div className="flex justify-left">
          <Separator className='bg-primary w-56 h-2'/>
        </div>
      </div>
    </div>
    <div className="relative w-full container mx-auto xl:px-24 lg:px-16 px-10 pb-8 h-fit">
    
    
    <div className={`md:grid md:grid-cols-2 block border-2 rounded-lg shadow-lg overflow-hidden hover:border-primary ${
    activeMapIndex === 0 && 'border-primary'}`} onMouseEnter={() => setActiveMapIndex(0)} onClick={handleScrollToTop}>
      {/* Left Side: Text */}
      <div className="p-4">
        <div className="pb-4">
          <h2 className="md:text-4xl text-3xl font-bold text-black pb-2">MAIN OFFICE</h2>
          <Separator className="bg-primary w-56 h-2" />
        </div>

        <h3 className="text-black font-bold text-2xl pb-2">SURABAYA</h3>
        <div className="flex text-black pb-4">
          <div className="pr-2">
            <MapPin size={20} />
          </div>
          <h3>: Jl. Margomulyo No.5, Tandes - Surabaya 60186</h3>
        </div>

        <div className="text-black font-bold text-xl pb-2">
          {t("contact-title")}
        </div>
        <div className="flex text-black">
          <div className="pr-2">
            <Phone size={20} />
          </div>
          <h3>: +62 31 748 0011 (Phone)</h3>
        </div>
        <div className="flex text-black">
          <div className="pr-2">
            <Phone size={20} />
          </div>
          <h3>: +62 31 749 3777 (Fax)</h3>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="relative md:block hidden">
        <LazyImageContact src="/images/acr/SBE_Baru.webp" alt="Sinar Baja Electric Facility"/>
        {/* <Image
          src="/images/acr/SBE_Baru.webp"
          alt="Contact Us Page"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className="object-cover h-full"
        /> */}
      </div>
    </div>




    <div className="py-8">
      <div className={`md:grid md:grid-cols-2 block border-2 rounded-lg shadow-lg overflow-hidden hover:border-primary ${activeMapIndex === 1 && 'border-primary'}`} onMouseEnter={() => setActiveMapIndex(1)} onClick={handleScrollToTop}>
        {/* Left Side: Text */}
        <div className="p-4">
          <div className="pb-4">
            <h2 className="md:text-4xl text-3xl font-bold text-black pb-2">SHOWROOM - SBY</h2>
            <Separator className="bg-primary w-56 h-2" />
          </div>

          <h3 className="text-black font-bold text-2xl pb-2">SURABAYA</h3>
          <div className="flex text-black pb-4">
            <div className="pr-2">
              <MapPin size={20} />
            </div>
            <h3>: Jl. Genteng Besar No. 15A - Genteng</h3>
          </div>

          <div className="text-black font-bold text-xl pb-2">
            {t("contact-title")}
          </div>
          <div className="flex text-black">
            <div className="pr-2">
              <Phone size={20} />
            </div>
            <h3>: +62 81 231 833 504</h3>
          </div>
          <div className="flex text-black">
            <div className="pr-2">
              <Phone size={20} />
            </div>
            <h3>: +62 81 217 334 084</h3>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="relative md:block hidden">
          <LazyImageContact src="/images/acr/contact-us-page-sby.webp" alt="Showroom ACR Speaker Surabaya"/>
          {/* <Image
            src="/images/acr/contact-us-page-sby.webp"
            alt="Contact Us Page"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            className="object-cover h-full"
          /> */}
        </div>
      </div>

    </div>




    <div className={`md:grid md:grid-cols-2 block border-2 rounded-lg shadow-lg overflow-hidden hover:border-primary ${ activeMapIndex === 2 && 'border-primary'}`} onMouseEnter={() => setActiveMapIndex(2)} onClick={handleScrollToTop}>
      {/* Left Side: Text */}
      <div className="p-4">
        <div className="pb-4">
          <h2 className="md:text-4xl text-3xl font-bold text-black pb-2">SHOWROOM - JKT</h2>
          <Separator className="bg-primary w-56 h-2" />
        </div>

        <h3 className="text-black font-bold text-2xl pb-2">JAKARTA</h3>
        <div className="flex text-black pb-4">
          <div className="pr-2">
            <MapPin size={20} />
          </div>
          <h3>
            {t("contact-jakarta-address")}
          </h3>
        </div>

        <div className="text-black font-bold text-xl pb-2">
          {t("contact-title")}
        </div>
        <div className="flex text-black">
          <div className="pr-2">
            <Phone size={20} />
          </div>
          <h3>: +62 811 3077 6724</h3>
        </div>
        <div className="flex text-black">
          <div className="pr-2">
            <Phone size={20} />
          </div>
          <h3>: +62 21 649 3139</h3>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="relative md:block hidden">
      <LazyImageContact src="/images/acr/contact-us-page-jkt.webp" alt="Showroom ACR Speaker Jakarta"/>
        {/* <Image
          src="/images/acr/contact-us-page-jkt.webp"
          alt="Contact Us Page"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className="object-cover h-full"
          priority
        /> */}
      </div>
    </div>



    </div>
    </div>
    </>
  );
}