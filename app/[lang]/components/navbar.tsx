"use client"

import Link from 'next/link';
import Image from 'next/image';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from './ui/navigation-menu';
import { Menu, Search } from 'lucide-react';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import LanguageSelectorModal from '@/components/LanguageSelectorModal';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSelectorNavbar from '@/components/LanguageSelectorNavbar';
import { Loader } from './ui/loader';

const DynamicSearchboxLoad = dynamic(() => import('./searchbox'), {
  ssr: false,
  loading: () => 
    <div className="fixed top-0 left-0 w-screen h-screen bg-foreground backdrop-blur-xs z-101 p-8 flex items-center justify-center">
      <Loader />
    </div>
})

const DynamicNavbarContentMobileLoad = dynamic(() => import('./navbarContentMobile'), {
  ssr: false,
  loading: () => 
    <div className="bg-foreground w-screen h-screen flex justify-center items-center">
      <Loader />
    </div>
})

const DynamicNavbarContentLoad = dynamic(() => import('./navbarContent'), {
  ssr: false,
  loading: () => 
    <div className="fixed left-0 right-0 w-full h-screen items-center justify-center shadow-md bg-secondary-foreground flex">
      <Loader />
    </div>
})

function Navbar() {
  const t = useTranslations('Navbar');

  const locale = useLocale()
  //OTHER
  const [searchBoxOpen, setSearchBoxOpen] = useState<boolean>(false)
  const [navbarContentMobileOpen, setnavbarContentMobileOpen] = useState<boolean>(false)
  const [navbarContentOpen, setnavbarContentOpen] = useState<boolean>(false)

  return ( 
    // loading?
    //   <FullScreenLoader isVisible={loading} />
    // :
    <div className="relative w-full overflow-x-hidden bg-foreground shadow-md">
     <div className="container mx-auto flex px-10 xl:px-24 lg:px-16">
     <div className='w-fit flex xl:hidden py-4'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={null} className={`w-fit p-0 text-background hover:text-primary hover:cursor-pointer`} onClick={() => setnavbarContentMobileOpen(true)}>
                <Menu size={40} className="" />
              </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="w-screen h-auto p-0 overflow-y-auto bg-foreground">
            <SheetTitle/>
            {navbarContentMobileOpen && <DynamicNavbarContentMobileLoad/>}
          </SheetContent>
        </Sheet>
      </div>
      <div className="xl:w-1/6 w-full flex items-center xl:justify-start justify-center">
        <Link href={locale === 'id' ? '/' : `/${locale}`} className="flex items-center">
        <Image
          src="/images/acr/logo_acr.webp"
          alt="ACR Speaker Logo"
          className="h-9 max-w-[150px] w-auto transition-transform duration-300 ease-in-out hover:scale-105"
          width={160}
          height={40}
          priority
        />
        </Link>
      </div>
        {/* {isDesktop && */}






        <div className="w-full xl:flex hidden justify-end">
          <NavigationMenu>
            <NavigationMenuList className='text-background'>
              <NavigationMenuItem className='hover:bg-secondary-foreground'>
                  <NavigationMenuLink href={locale === 'id' ? '/' : `/${locale}`} className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)}>
                    {t('home')}
                  </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)} onMouseEnter={() => setnavbarContentOpen(true)}>{t('products')}</NavigationMenuTrigger>
                
                {navbarContentOpen && <DynamicNavbarContentLoad/>}
              </NavigationMenuItem>
              
              <NavigationMenuItem className='hover:bg-secondary-foreground'>
                  <NavigationMenuLink href={locale === 'id' ? '/komparasi' : `/${locale}/comparison`} className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)}>{t('comparison')}</NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className='hover:bg-secondary-foreground'>
                  <NavigationMenuLink href={locale === 'id' ? '/berita' : `/${locale}/news`} className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)}>{t('news')}</NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className='hover:bg-secondary-foreground'>
                  <NavigationMenuLink href={locale === 'id' ? '/tentang-kami' : `/${locale}/about-us`} className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)}>{t('about-us')}</NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className='hover:bg-secondary-foreground'>
                  <NavigationMenuLink href={locale === 'id' ? '/katalog' : `/${locale}/catalogues`} className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)}>{t('catalogue')}</NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className='hover:bg-secondary-foreground'>
                  <NavigationMenuLink href={locale === 'id' ? '/distributor' : `/${locale}/distributors`} className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)}>{t('distributors')}</NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem className='hover:bg-secondary-foreground'>
                  <NavigationMenuLink href={locale === 'id' ? '/kontak' : `/${locale}/contact`} className={navigationMenuTriggerStyle().concat(` bg-transparent font-normal px-2`)}>{t('contact')}</NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
          <div className={` w-1/6 flex items-center justify-end`}>
            
            <div className={`font-bold text-background hover:text-primary hover:cursor-pointer mr-2`}>
              <LanguageSelectorModal />
              <LanguageSelectorNavbar />
            </div>
            <div className={`font-bold bg-primary px-2 rounded-md text-background hover:text-primary hover:cursor-pointer hover:bg-background duration-300 ease-in-out transition-all`} onMouseEnter={() => setSearchBoxOpen(false)} onClick={() => searchBoxOpen? setSearchBoxOpen(false): setSearchBoxOpen(true)}>
            <Search size={25} className="m-2 hover:cursor-pointer" />
            </div>
          </div>
        </div>
         
      {searchBoxOpen && <DynamicSearchboxLoad/>}


      {/* MAIN MENU TABLET & MOBILE VIEW */}
      {/* {isMobile &&  */}
      <div className='flex xl:hidden w-fit justify-end items-center'>
        <Button variant={null} asChild className='justify-start p-0'>
          <div className={`w-full text-base hover:text-primary text-background`}
              onMouseDown={() => setSearchBoxOpen(false)}
              onClick={() => searchBoxOpen ? setSearchBoxOpen(false) : setSearchBoxOpen(true)} >
            <div 
              className='flex items-left text-base'
            >
              <Search size={40} className="hover:cursor-pointer" />
              {/* <SearchBox mobile={true}/> */}
            </div>
          </div>
        </Button>
      </div>

    </div>
  </div>
  );
}

export default Navbar;