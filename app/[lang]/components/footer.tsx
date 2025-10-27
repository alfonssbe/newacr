import Image from 'next/image';
import { FindUs } from './FindUs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import LanguageSelectorMobileFooter from '@/components/languageSelectorMobileFooter';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <div className="relative md:py-0 py-10 bg-foreground">
      <div className='relative z-10 container mx-auto xl:px-24 lg:px-16 px-10 xl:py-8 lg:py-6 py-4'>
        <h2 className='sr-only'>ACR Speaker Footer Navigation</h2>
      <div className="text-background font-bold sm:text-2xl text-lg text-center">
        <div className='block'>
          <h3>{t('footer-other-brand')}</h3>
          <div className="md:grid md:grid-cols-1 flex px-4 items-center gap-4 py-8">

            <div className="md:mx-0 mx-auto flex items-center justify-center gap-4 xl:px-72 lg:px-56 md:px-12 px-0 py-0 text-center h-auto w-full md:max-w-none">
          <h4 className='sr-only'>Rhyme Audio</h4>
              <Link
                href="https://rhymeaudio.com/"
                target="_blank"
                aria-label="Visit Rhyme Audio Website"
              >
                <Image
                  src="/images/acr/Rhyme2.webp"
                  alt="Rhyme Logo"
                  width={200}
                  height={150}
                  className="object-contain transition-transform duration-300 hover:scale-110 mx-auto "
                  loading="lazy"
                />
              </Link>
            <h4 className='sr-only'>Legacy Speaker</h4>
              <Link
                href="https://legacy.us.com/"
                target="_blank"
                aria-label="Visit Legacy Speaker Website"
              >
                <Image
                  src="/images/acr/logo_legacy.webp"
                  alt="Legacy Logo"
                  width={200}
                  height={150}
                  className="object-contain transition-transform duration-300 hover:scale-110 mx-auto pt-0"
                  loading="lazy"
                />
              </Link>
            </div>

          </div>
        </div>
            <Separator className='md:hidden block opacity-50' />



        <div className="md:hidden block w-full h-full">
          <div className='md:hidden block justify-center items-center w-full h-full pb-4'>
            <div className='text-background py-6 text-sm font-bold'>{t('footer-download-mysbe')}</div>
              <Link href="https://play.google.com/store/apps/details?id=id.sbe.mysbe.customer&hl=id&pli=1" target="__blank" className="flex font-bold text-center items-center justify-center">
                <Image src={"/images/acr/mysbe.webp"} alt="MySBE Logo" width={125} height={125} className="rounded-lg" />
              </Link>  
          </div>
          <Separator className='opacity-50 md:hidden block' />
          <div className='py-4 flex justify-center items-center'>
            <FindUs scrolled={false} type='footer'/>
          </div>
        </div>
        <Separator className="opacity-50 md:block hidden" />
      </div>

      <div className="md:grid md:grid-cols-2 flex flex-col w-full h-auto md:pt-8">
        <div className="md:order-1 order-2 flex flex-col items-center md:items-start text-center md:text-left">
          <div>
            <h3 className="text-lg lg:text-3xl font-bold text-white pb-1 md:block hidden">
              CV. Sinar Baja Electric Surabaya
            </h3>
            <div className="md:block hidden py-2">
            </div>
            <div className="text-xs text-white md:pb-4 font-light block pb-2">
              <h4 className="flex items-center justify-center md:justify-start">
                {t('footer-factory-1')}
              </h4>
              <h4 className="flex items-center justify-center md:justify-start">
                {t('footer-factory-2')}
              </h4>
            </div>
            <h4 className="text-xs text-white md:pb-1 font-light block">
              {t('footer-showroom-1')}
            </h4>
            <h4 className="text-xs text-white md:pb-1 pb-2 font-light block">
              {t('footer-showroom-1-contact')}
            </h4>
            <h4 className="text-xs text-white md:pb-1 font-light block">
              {t('footer-showroom-2')}
            </h4>
            <h4 className="text-xs text-white md:pb-1 pb-4 font-light block">
              {t('footer-showroom-2-contact')}
            </h4>
            <Separator className="opacity-50 md:hidden block" />
            <div className="md:flex hidden items-start pt-4">
              <LanguageSelectorMobileFooter indo='BAHASA INDONESIA' eng='ENGLISH' />
            </div>

            <div className="md:hidden block py-4">
              <div className='text-sm text-background'>{t('footer-language-choice')}</div>
              <div className="flex items-center justify-center py-4">
                <LanguageSelectorMobileFooter indo='ID' eng='EN' />
              </div>
            </div>
          </div>
        </div>
        <div className="md:order-2 order-1 flex flex-col items-center md:items-end w-full h-full">
         
          <div className='md:block hidden'>
            <FindUs scrolled={false} type="footer" />
            <h3 className='sr-only'>{t('footer-download-mysbe-heading')}</h3>
            <div className='text-background py-4 text-right'>
              {t('footer-download-mysbe')}
            </div>
              <Link href="https://play.google.com/store/apps/details?id=id.sbe.mysbe.customer&hl=id&pli=1" target="__blank" className="flex text-white font-bold text-end justify-end">
                <Image src={"/images/acr/mysbe.webp"} alt="MySBE Logo" width={125} height={125} className="rounded-lg" />
              </Link>  
          </div>
        </div>
      </div>
        {/* <Separator className='md:hidden block opacity-50' /> */}
        <div className='text-center text-xs justify-center text-white md:pt-16 pt-0 font-light'>
          ©{new Date().getFullYear()} ACR SPEAKER - ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
}
