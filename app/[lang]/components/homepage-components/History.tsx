import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

const History: React.FC = () => {
  const t = useTranslations('About Us Home');
  const locale = useLocale()
  return (
    <div className="relative w-full h-fit bg-secondary">
     <div className="container mx-auto xl:px-24 lg:px-16 px-10 md:py-4 py-12 h-fit md:flex block items-center">
        <div className='h-full w-fit'>
          <Image
            src='/images/acr/tentang-kami-white.webp'
            alt='About ACR Speaker'
            width={500}
            height={300}
            className='max-h-[500px] w-auto z-10'
          />
        </div>
        <div className='md:pl-8 md:w-3/5 w-full'>
          <h2 className='text-3xl font-bold text-black pb-4 md:pt-0 pt-4'>
            {t('about-title')}
          </h2>
          <h3 className='py-4 text-black pr-4 w-full md:text-base text-sm'>
            <p>
              {t('about-description-1')}  <b>ISO 9001</b>, <b>ISO 14001</b>, <b>ISO 45001</b>, {t('about-description-1-1')} <b>IATF 16949</b>{t('about-description-1-2')}
            </p>
            <p>
              {t('about-description-2')}
            </p>
          </h3>
          <Button asChild variant={'default'} className='md:w-fit w-full px-28 rounded-full'>
            <Link href={locale === 'id' ? "/tentang-kami" : `/${locale}/about-us`} className='text-white font-extrabold'>{t('about-button-desc')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default History;
