"use client"

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { Parallax, Autoplay, Navigation } from 'swiper/modules';
import { Hero } from '@/app/types';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { useRef, useState } from 'react';

type PropType = {
  slides: Hero[];
};

const SwiperCarousel: React.FC<PropType> = (props) => {
  const { slides } = props;
  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  return (
    <div className="relative">
      <Swiper
        speed={600}
        parallax={true}
        autoplay={{
            delay: 5000,
            disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          const indexAttr = swiper.slides[swiper.activeIndex]?.getAttribute('data-swiper-slide-index');
          const real = indexAttr ? parseInt(indexAttr) : 0;
          setRealIndex(real);
        }}
        modules={[Autoplay, Navigation, Parallax]}
        className="swiper bg-foreground"
      >
        {slides && slides.length > 0 && slides.map((item, indexParent) => (
          <SwiperSlide key={item.name.concat(` ${indexParent}`)}>
            <div className="absolute h-[80vh] bottom-0 parallax-bg">
              <img
                className="w-screen h-full object-cover object-bottom"
                src={item.imgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.imgUrl}` : item.imgUrl}
                alt={`${item.name} - Hero Image`}
                width={1920}
                height={1024}
              />  
            </div>
          <div className="container mx-auto flex flex-col md:flex-row items-end md:items-center xl:px-24 lg:px-16 px-10 pb-16 pt-6 h-[80vh]">

          <div className="order-2 md:order-1 flex flex-col items-start text-left gap-2 w-full z-50 h-full md:justify-end justify-start">

                <h3 className="text-3xl md:text-7xl font-bold text-background" data-swiper-parallax="-250">
                  {item.name} 
                </h3>
                <div className="text-3xl md:text-7xl font-bold text-background" data-swiper-parallax="-300">
                  {item.featuredDesc}
                </div>
                <Link
                  href={item.buttonLink}
                  className="text-xl md:text-3xl text-primary font-bold z-50 flex gap-4 items-center justify-center hover:underline" data-swiper-parallax="-400"
                >
                  {item.buttonDesc}
                  <MoveRight size={40}/>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`w-12 h-2 rounded-none transition-all duration-300 ${
              realIndex === index ? 'bg-primary scale-125' : 'bg-background'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};


export default SwiperCarousel;
