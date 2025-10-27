import Image from 'next/image';
import { Check, Settings } from 'lucide-react';
import SwiperCarouselKeunggulan from '@/app/[lang]/components/ui/swipercarouselkeunggulan';
import { useTranslations } from 'next-intl';

const Keunggulan: React.FC = () => {
  const t = useTranslations('Keunggulan Home');
  return (
    <div className="relative w-full h-fit bg-secondary">
      <h2 className='sr-only'>{t('h2 title')}</h2>
      <div className="container mx-auto xl:px-24 lg:px-16 px-10 xl:py-16 lg:py-10 py-6 h-fit">
          {/* <Link key={index} href={series.href} className="group cursor-pointer relative"> */}
          <div className='md:grid hidden md:grid-cols-3 gap-6'>

            <div className="overflow-hidden block h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <Settings size={40} className='font-bold text-primary'/>
                <div className="pt-4">
                  <h3 className="md:text-base text-sm text-black text-center">
                  {t('description 1')}
                  </h3>
                </div>
              </div>
            </div>

            <div className="overflow-hidden block h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <Image src={`/images/acr/indo-flag.svg`} alt="Indonesian Flag" width={50} height={50} className="w-auto h-10 shadow-md" />
                <div className="pt-4">
                  <h3 className="md:text-base text-sm text-black text-center">
                    {t('description 2')}
                  </h3>
                </div>
              </div>
            </div>

            <div className="overflow-hidden block h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <Check size={40} className='font-bold text-primary'/>
                <div className="pt-4">
                  <h3 className="md:text-base text-sm text-black text-center">
                    {t('description 3')}
                  </h3>
                </div>
              </div>
            </div>

          </div>

          {/* </Link> */}
          
          <div className='md:hidden block'>
            <SwiperCarouselKeunggulan/>
          </div>
      </div>
    </div>
  );
};

export default Keunggulan;
