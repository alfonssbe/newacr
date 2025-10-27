"use client"

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { Check, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';



export default function SwiperCarouselKeunggulan() {
  const t = useTranslations('Keunggulan Home');
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      modules={[FreeMode, Navigation, Autoplay]}
      className="mySwiper"
      loop={true}
      // navigation={true}    
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      // style={{
      //   //@ts-ignore
      //   "--swiper-navigation-color": "#ee3239",
      //   "--swiper-navigation-size": "15px",
      //   "--swiper-navigation-sides-offset": "0px",
      // }}
    >
        <SwiperSlide>
          <div className="flex flex-col items-center justify-center h-full">
            <Settings size={40} className='font-bold text-primary'/>
            <div className="pt-4">
              <p className="md:text-base text-sm text-black text-center">
                {t('description 1')}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col items-center justify-center h-full">
            <Image src={`/images/acr/indo-flag.svg`} alt="Indonesian Flag" width={50} height={50} className="w-auto h-10 shadow-md" />
            <div className="pt-4">
              <p className="md:text-base text-sm text-black text-center">
                {t('description 2')}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col items-center justify-center h-full">
            <Check size={40} className='font-bold text-primary'/>
            <div className="pt-4">
              <p className="md:text-base text-sm text-black text-center">
                {t('description 3')}
              </p>
            </div>
          </div>
        </SwiperSlide>
    </Swiper>
  );
}
