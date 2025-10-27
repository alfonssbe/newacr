"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetDescription, SheetTitle } from "./ui/sheet";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordionmobilemenu";
import { Loader, Menu, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import LanguageSelectorMobileFooter from "@/components/languageSelectorMobileFooter";
import { LazyImageCustom } from "./lazyImageCustom";
import { FindUs } from "./FindUs";

const DynamicSearchboxLoad = dynamic(() => import('./searchbox'), {
  ssr: false,
  loading: () => 
    <div className="fixed top-0 left-0 w-screen h-screen bg-foreground/80 backdrop-blur-xs z-101 p-8 flex items-center justify-center">
      <Loader size={20} className="animate-spin text-primary" />
    </div>
})


function NavbarContentMobile (){
    const t = useTranslations('Navbar');
    const [searchBoxOpen, setSearchBoxOpen] = useState<boolean>(false)
    const locale = useLocale()
    return(          
    <div className="container mx-auto items-center px-10 xl:px-24 lg:px-16 py-8">
          <SheetTitle/>
            <SheetDescription/>
             <div className="grid grid-cols-3">
                      <div></div>
                    <div className="flex justify-center">
                      <Link
                        href={locale === 'id' ? '/' : `/${locale}`}
                        onClick={() => {
                          setSearchBoxOpen(false);
                        }}
                        className="flex items-center justify-center"
                      >
                        <LazyImageCustom
                          src="/images/acr/logo_acr.webp"
                          alt="ACR Speaker Logo"
                          width={1000}
                          height={1000}
                          lazy={false}
                          classname="max-w-[100px] h-fit object-contain cursor-pointer"
                        />
                      </Link>
                    </div>
            
                    {/* Close - Right */}
                    <div className="flex justify-end">
                    <SheetClose asChild>
                      <Button
                        className="p-2 text-foreground/60 hover:text-foreground transition-colors bg-transparent hover:bg-transparent"
                      >
                        <X className="p-1 border rounded-lg w-8 h-8 text-background hover:text-primary hover:border-primary"/>
                        <span className="sr-only">Close</span>
                      </Button>
                    </SheetClose>
                    </div>
                  </div>
     
            <div className="grid pt-12 gap-4">

            <Button variant={null} asChild>
                  <Link href={locale === 'id' ? '/' : `/${locale}`}>
                  <SheetClose className='w-full text-xl hover:text-primary text-white px-6 font-normal'>
                    {t('home')}
                    </SheetClose>
                  </Link>
              </Button>

            <Accordion type="single" collapsible className="w-full px-6">
              <AccordionItem value="item-1" className="text-center">
                <AccordionTrigger className='hover:text-primary text-white justify-center font-normal'>
                  <div className='pr-1 text-xl'>{t('products')}</div>
                </AccordionTrigger>
                <AccordionContent className="border py-2 mt-4">
                  <Link href={locale === 'id' ? '/driver' : `/${locale}/drivers`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                      {t('all-drivers')}
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>
                <AccordionContent className="border py-2">
                  <Link href={locale === 'id' ? '/driver/subwoofer' : `/${locale}/drivers/subwoofer`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                        SUBWOOFER
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>
                <AccordionContent className="border py-2">
                  <Link href={locale === 'id' ? '/driver/woofer' : `/${locale}/drivers/woofer`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                        WOOFER
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>
                <AccordionContent className="border py-2">
                  <Link href={locale === 'id' ? '/driver/full-range' : `/${locale}/drivers/full-range`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                        FULLRANGE
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>
                <AccordionContent className="border py-2">
                  <Link href={locale === 'id' ? '/driver/midrange' : `/${locale}/drivers/midrange`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                        MIDRANGE
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>
                <AccordionContent className="border py-2">
                  <Link href={ locale === 'id' ? '/driver/tweeter' : `/${locale}/drivers/tweeter`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                        TWEETER
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>
                <AccordionContent className="border py-2">
                  <Link href={ locale === 'id' ? '/sparepart' : `/${locale}/spareparts`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                        {locale === 'id' ? 'SPAREPART' : 'SPAREPARTS'}
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>
                <AccordionContent className="border py-2">
                  <Link href={ locale === 'id' ? '/driver/discontinued' : `/${locale}/drivers/discontinued`} passHref>
                  <SheetClose>
                    <div className={`hover:text-primary text-background text-xl`}>
                        DISCONTINUED
                    </div>
                    </SheetClose>
                  </Link>
                </AccordionContent>               
              </AccordionItem>
            </Accordion>

              <Button variant={null} asChild>
                  <Link href={locale === 'id' ? '/komparasi' : `/${locale}/comparison`}>
                  <SheetClose className='w-full text-xl hover:text-primary text-white px-6 font-normal'>
                    {t('comparison')}
                    </SheetClose>
                  </Link>
              </Button>
              <Button variant={null} asChild>
                  <Link href={locale === 'id' ? '/tentang-kami' : `/${locale}/about-us`}>
                  <SheetClose className='w-full text-xl hover:text-primary text-white px-6 font-normal'>
                    {t('about-us')}
                    </SheetClose>
                  </Link>
              </Button>
              <Button variant={null} asChild>
                  <Link href={locale === 'id' ? '/berita' : `/${locale}/news`}>
                  <SheetClose className='w-full text-xl hover:text-primary text-white px-6 font-normal'>
                    {t('news')}
                    </SheetClose>
                  </Link>
              </Button>
              <Button variant={null} asChild>
                  <Link href={locale === 'id' ? '/katalog' : `/${locale}/catalogues`}>
                  <SheetClose className='w-full text-xl hover:text-primary text-white px-6 font-normal'>
                    {t('catalogue')}
                    </SheetClose>
                  </Link>
              </Button>
              <Button variant={null} asChild>
                  <Link href={locale === 'id' ? '/distributor' : `/${locale}/distributors`}>
                  <SheetClose className='w-full text-xl hover:text-primary text-white px-6 font-normal'>
                    {t('distributors')}
                    </SheetClose>
                  </Link>
              </Button>

              <Button variant={null} asChild>
                  <Link href={locale === 'id' ? '/kontak' : `/${locale}/contact`}>
                  <SheetClose className='w-full text-xl hover:text-primary text-white px-6 font-normal'>
                    {t('contact')}
                    </SheetClose>
                  </Link>
              </Button>
            </div>
            <div className="pt-12">
              <LanguageSelectorMobileFooter indo="ID" eng="EN"/>
            </div>
            <div className="flex justify-center items-center pt-12">
              <FindUs scrolled={false} type='navbar'/>
            </div>
      {searchBoxOpen && <DynamicSearchboxLoad/>}

      </div>
    )
}

export default NavbarContentMobile