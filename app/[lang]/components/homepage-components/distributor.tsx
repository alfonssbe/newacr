import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FindUs } from '@/app/[lang]/components/FindUs';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

const Distributor: React.FC = () => {
  const t = useTranslations('Distributors Home');
  const locale = useLocale()
  return (
    <div className="relative w-full h-fit bg-background">
     <div className="container mx-auto xl:px-24 lg:px-16 px-10 py-8 h-fit block items-center lg:grid lg:grid-cols-3 gap-16">
        <div className='h-full flex flex-col items-start'>
          <h2 className='text-3xl flex items-start justify-start font-bold text-foreground pb-4'>
            {t('distributors-title-1')}
          </h2>
          {/* <Separator className='bg-foreground w-56 h-2'/> */}
          <div className='pb-4 text-foreground text-sm w-full'>
            {t('distributors-desc-1')}
          </div>
          <Button asChild variant={'default'} className='w-full px-12 justify-center lg:block hidden rounded-full h-fit'>
            <Link href={locale === 'id' ? "/distributor" : `/${locale}/distributors`} className='text-white flex text-center items-center justify-center'>
              {t('distributors-button-desc-1')}
            </Link>
          </Button>
          <Button asChild variant={'default'} className='w-full lg:hidden block rounded-full h-fit'>
            <Link href={locale === 'id' ? "/distributor" : `/${locale}/distributors`} className='text-white font-extrabold text-center justify-center'>{t('distributors-button-desc-1')}</Link>
          </Button>
        </div>


        <div className="h-full flex flex-col items-start">
          {/* Title - stick to top */}
          <h2 className="text-3xl font-bold text-foreground pb-4 lg:pt-0 pt-4">
            {t('distributors-title-2')}
          </h2>

          {/* Grid Content */}
        <div className="flex gap-4 items-center">
          {/* Image column */}
          <div className="text-foreground w-fit h-full flex items-start">
            <Image
              src="/images/acr/mysbe.webp"
              alt="MySBE Logo"
              width={150}
              height={150}
              className="md:w-[150px] w-full max-w-[150px] min-w-[100px] h-auto rounded-lg shadow-md object-contain"
            />
          </div>

          {/* Text + Button column */}
          <div className="flex flex-col justify-between h-full">
            <div className="text-foreground text-sm w-full">
              {t('distributors-desc-2')}
            </div>

            <Button asChild variant="default" className="w-full rounded-full mt-2">
              <Link
                href="https://play.google.com/store/apps/details?id=id.sbe.mysbe.customer&hl=id&pli=1"
                target="__blank"
                className="text-foreground font-bold text-center justify-center"
              >
                {t('distributors-button-desc-2')}
              </Link>
            </Button>
          </div>
        </div>

        </div>
        <div className="h-full lg:flex lg:flex-col hidden items-end">
          {/* Title - stick to top */}
          <h2 className="text-3xl font-bold text-foreground pb-4">
            {t('distributors-title-3')}
          </h2>
          {/* <Separator className='bg-foreground w-56 h-2'/> */}
          <div className='py-11'>
            <FindUs scrolled={true} type='navbar'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Distributor;