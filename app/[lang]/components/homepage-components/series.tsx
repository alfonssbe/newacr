import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Series: React.FC = () => {
  const t = useTranslations('Series Home');
  const locale = useLocale()
  return (
    <div className="relative w-full h-fit bg-secondary">
      <h2 className="sr-only">{t('h2 title')}</h2>
      <h3 className="sr-only">{t('h3 acr series')}</h3>
      <h3 className="sr-only">{t('h3 acr fabulous')}</h3>
      <h3 className="sr-only">{t('h3 acr deluxe')}</h3>
      <h3 className="sr-only">{t('h3 acr excellent')}</h3>
      <h3 className="sr-only">{t('h3 acr premier')}</h3>
      <h3 className="sr-only">{t('h3 desibel series')}</h3>
      <h3 className="sr-only">{t('h3 curve series')}</h3>
      <h3 className="sr-only">{t('all speaker')}</h3>
      <h3 className="sr-only">{t('all subwoofer')}</h3>
      <h3 className="sr-only">{t('all woofer')}</h3>
      <h3 className="sr-only">{t('all midrange')}</h3>
      <h3 className="sr-only">{t('all fullrange')}</h3>
      <h3 className="sr-only">{t('all tweeter')}</h3>
      <h3 className="sr-only">{t('all compression driver')}</h3>
      <h3 className="sr-only">{t('all sparepart')}</h3>
     <div className="container mx-auto xl:px-24 lg:px-16 px-10 md:py-4 py-0 h-fit block items-center">
      <div className="text-lg lg:text-3xl font-bold pt-4 pb-2">{t('series-title')}:</div> 

       {/* ACR DESKTOP */}
        <div className="md:block hidden">
          <Link href={locale === 'id' ? "/driver/acr" : `/${locale}/drivers/acr`}>
            <div className="grid grid-cols-1 2xl:px-80 xl:px-64 lg:px-44 md:px-28 sm:px-14 px-8 bg-primary rounded-md group font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-32 ">
              {/* <div></div> */}
              <div className="overflow-hidden grid grid-cols-3 items-center">
                <div className="flex items-center justify-center h-full col-span-2 relative">
                  <Image
                    src="/images/acr/series/acr_series_desktop.webp"
                    alt="ACR Series Driver"
                    width={500}
                    height={500}
                    className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:object-center"
                  />
                </div>
                <div className="flex items-center justify-start px-4 z-10 col-span-1">
                <Image
                    src="/images/acr/series_logo/acr_red_bg.webp"
                    alt="ACR Logo"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ACR Mobile */}
        <div className="md:hidden block">
          <Link href={locale === 'id' ? "/driver/acr" : `/${locale}/drivers/acr`}>
            <div className="overflow-hidden group rounded-md bg-primary font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-32 grid grid-cols-2 items-center">
              <div className="flex items-center justify-center h-full col-span-1 relative">
                <Image
                  src="/images/acr/series/acr_series_mobile.webp"
                  alt="ACR Series Driver"
                  width={500}
                  height={500}
                  className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:rotate-45 lg:group-hover:scale-125 group-hover:scale-110 group-hover:object-center"
                />
              </div>
              <div className="flex items-center justify-start px-4 z-10 col-span-1">
                <Image
                  src="/images/acr/series_logo/acr_red_bg.webp"
                  alt="ACR Logo"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </Link>
        </div>

      {/* ACR DELUXE */}
        <div className="md:grid md:grid-cols-2 block gap-4 pt-4">
          <Link href={locale === 'id' ? "/driver/acr/fabulous" : `/${locale}/drivers/acr/fabulous`}>
            <div className="overflow-hidden group rounded-md bg-linear-to-r from-foreground/50 to-background font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-24 grid grid-cols-2 items-center">
              <div className="flex items-center justify-center h-full col-span-1 relative">
                <Image
                  src="/images/acr/series/fabulous_series.webp"
                  alt="Fabulous Series Driver"
                  width={500}
                  height={500}
                  className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:rotate-45 lg:group-hover:scale-125 group-hover:scale-110  group-hover:object-center"
                />
              </div>
              <div className="flex items-center justify-start px-4 z-10 col-span-1">
                <Image
                  src="/images/acr/series_logo/fabulous_white_bg.webp"
                  alt="Fabulous Series Logo"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </Link>
          <div className="md:py-0 py-4">
            <Link href={locale === 'id' ? "/driver/acr/deluxe" : `/${locale}/drivers/acr/deluxe`}>
              <div className="overflow-hidden group rounded-md bg-linear-to-r from-foreground/50 to-background font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-24 grid grid-cols-2 items-center">
                <div className="flex items-center justify-center h-full col-span-1 relative">
                  <Image
                    src="/images/acr/series/deluxe_series.webp"
                    alt="Deluxe Series Driver"
                    width={500}
                    height={500}
                    className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:rotate-45 lg:group-hover:scale-125 group-hover:scale-110  group-hover:object-center"
                  />
                </div>
                <div className="flex items-center justify-start px-4 z-10 col-span-1">
                  <Image
                    src="/images/acr/series_logo/deluxe_white_bg.webp"
                    alt="Deluxe Series Logo"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* EXCELLENT PREMIER */}
        <div className="md:grid md:grid-cols-2 block gap-4 md:pt-4 pt-0">
          <div className="md:pb-0 pb-4">
            <Link href={ locale === 'id' ? "/driver/acr/excellent" : `/${locale}/drivers/acr/excellent`}>
              <div className="overflow-hidden group rounded-md bg-linear-to-r from-foreground/50 to-background font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-24 grid grid-cols-2 items-center">
                <div className="flex items-center justify-center h-full col-span-1 relative">
                  <Image
                    src="/images/acr/series/excellent_series.webp"
                    alt="Excellent Series Driver"
                    width={500}
                    height={500}
                    className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:rotate-45 lg:group-hover:scale-125 group-hover:scale-110  group-hover:object-center"
                  />
                </div>
                <div className="flex items-center justify-start px-4 z-10 col-span-1">
                  <Image
                    src="/images/acr/series_logo/excellent_white_bg.webp"
                    alt="Excellent Series Logo"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </Link>
          </div>
          <Link href={locale === 'id' ? "/driver/acr/premier" : `/${locale}/drivers/acr/premier`}>
            <div className="overflow-hidden group rounded-md bg-linear-to-r from-foreground/50 to-background font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-24 grid grid-cols-2 items-center">
              <div className="flex items-center justify-center h-full col-span-1 relative">
                <Image
                  src="/images/acr/series/premier_series.webp"
                  alt="Premier Series Driver"
                  width={500}
                  height={500}
                  className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:rotate-45 lg:group-hover:scale-125 group-hover:scale-110  group-hover:object-center"
                />
              </div>
              <div className="flex items-center justify-start px-4 z-10 col-span-1">
                <Image
                  src="/images/acr/series_logo/premier_white_bg.webp"
                  alt="Premier Series Logo"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </Link>
        </div>
  

        {/* Desibel Curve */}
        <div className="md:grid md:grid-cols-2 block gap-4 md:pt-4 pt-0">
          <div className="md:py-0 py-4">
            <Link href={locale === 'id' ? "/driver/desibel" : `/${locale}/drivers/desibel`}>
              <div className="overflow-hidden group rounded-md bg-[rgba(13,65,143,1)] font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-32 grid md:grid-cols-5 grid-cols-2 items-center">
                <div className="md:flex hidden items-center justify-center h-full md:col-span-3 col-span-1 relative">
                  <Image
                    src="/images/acr/series/desibel_series_desktop.webp"
                    alt="Desibel Series Driver"
                    width={500}
                    height={500}
                    className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:object-center"
                  />
                </div>
                <div className="md:hidden flex items-center justify-center h-full md:col-span-3 col-span-1 relative">
                  <Image
                    src="/images/acr/series/desibel_series_mobile.webp"
                    alt="Desibel Series Driver"
                    width={500}
                    height={500}
                  className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:rotate-45 lg:group-hover:scale-125 group-hover:scale-110  group-hover:object-center"
                  />
                </div>
      
                <div className="flex items-end justify-end px-4 w-11/12 z-10 md:col-span-2 col-span-1">
                  <Image
                    src="/images/acr/series_logo/desibel_blue_bg.webp"
                    alt="Desibel Series Logo"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </Link>
          </div>
          <Link href={ locale ==='id' ? "/driver/curve" : `/${locale}/drivers/curve`}>
            <div className="overflow-hidden group rounded-md bg-[rgba(0,152,218,1)] font-bold text-background hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out h-32 grid md:grid-cols-5 grid-cols-2 items-center">
                <div className="flex items-center justify-center h-full md:col-span-3 col-span-1 relative">
                <Image
                  src="/images/acr/series/curve_series.webp"
                  alt="Curve Series Driver"
                  width={500}
                  height={500}
                  className="w-auto max-h-44 absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:rotate-45 lg:group-hover:scale-125 group-hover:scale-110  group-hover:object-center"
                />
              </div>
              <div className="flex items-end justify-end px-4 w-11/12 z-10 md:col-span-2 col-span-1">
                <Image
                  src="/images/acr/series_logo/curve_blue_bg.webp"
                  alt="Curve Series Logo"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </Link>
        </div>


        <div className="text-lg lg:text-3xl font-bold py-4">{t('series-type')}:</div> 
        <div className="md:grid md:grid-cols-4 hidden gap-4">
          <Link href={ locale === 'id' ? "/driver" : `/${locale}/drivers` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              ALL
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/driver/subwoofer" : `/${locale}/drivers/subwoofer`}>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              SUBWOOFER
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/driver/woofer" : `/${locale}/drivers/woofer` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              WOOFER
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/driver/midrange" : `/${locale}/drivers/midrange` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              MIDRANGE
            </div>
          </Link>
        </div>

        <div className="md:grid md:grid-cols-4 hidden gap-4 py-4">
          <Link href={ locale === 'id' ? "/driver/full-range" : `/${locale}/drivers/full-range` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              FULLRANGE
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/driver/tweeter" : `/${locale}/drivers/tweeter` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              TWEETER
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/sparepart" : `/${locale}/spareparts` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              SPAREPART
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/driver/discontinued" : `/${locale}/drivers/discontinued`}>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              DISCONTINUED
            </div>
          </Link>
        </div>


        <div className="md:hidden grid grid-cols-2 gap-4">
          <Link href={ locale === 'id' ? "/driver" : `/${locale}/drivers`}>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              ALL
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/driver/subwoofer" : `/${locale}/drivers/subwoofer`}>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              SUBWOOFER
            </div>
          </Link>
        </div>
        <div className="md:hidden grid grid-cols-2 gap-4 pt-4">
          <Link href={ locale === 'id' ? "/driver/woofer" : `/${locale}/drivers/woofer`}>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              WOOFER
            </div>
          </Link>
          <Link href={ locale === 'id' ? "/driver/midrange" : `/${locale}/drivers/midrange` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              MIDRANGE
            </div>
          </Link>
        </div>
        <div className="md:hidden grid grid-cols-2 gap-4 py-4">
          <Link href={locale === 'id' ? "/driver/full-range" : `/${locale}/drivers/full-range` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              FULLRANGE
            </div>
          </Link>
          <Link href={locale === 'id' ? "/driver/tweeter" : `/${locale}/drivers/tweeter`}>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              TWEETER
            </div>
          </Link>
        </div>
        <div className="md:hidden grid grid-cols-2 gap-4">
          <Link href={ locale === 'id' ? "/sparepart" : `/${locale}/spareparts` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              SPAREPART
            </div>
          </Link>
          <Link href={locale ==='id' ? "/driver/discontinued" : `/${locale}/drivers/discontinued` }>
          <div className='flex items-center justify-center w-full h-20 rounded-md bg-foreground text-background font-bold hover:text-primary hover:shadow-md hover:shadow-primary/25 transition-all duration-300 ease-in-out text-center'>
              DISCONTINUED
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Series;
