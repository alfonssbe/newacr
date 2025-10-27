import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import { Products } from '@/app/types';
import ProductCard from './product-card';
import { useEffect, useRef, useState } from 'react';

interface SwiperCarouselNewsProps {
  featured: Products[];
}

export default function SwiperCarouselNewProduct({ featured }: SwiperCarouselNewsProps) {

  const [totalSlides, setTotalSlides] = useState(1); // default for mobile
  const [loopMode, setLoopMode] = useState<boolean>(true)
  const [initialized, setInitialized] = useState(false);
  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setTotalSlides(3); // lg
      } else if (width >= 768) {
        setTotalSlides(2); // md
      } else {
        setTotalSlides(1); // sm
      }
      featured && featured.length > 3 ? setLoopMode(true) : setLoopMode(false)
      setInitialized(true);
    };

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);
  
  if (!initialized) return null;

  return (
    <>
    <Swiper
      slidesPerView={totalSlides}
      spaceBetween={10}
      modules={[FreeMode, Navigation]}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onSlideChange={(swiper) => {
        const indexAttr = swiper.slides[swiper.activeIndex]?.getAttribute('data-swiper-slide-index');
        const real = indexAttr ? parseInt(indexAttr) : 0;
        setRealIndex(real);
      }}
      className="mySwiper"
      loop={loopMode}
      navigation={true}
      autoHeight={true}
      style={{
        //@ts-ignore
        "--swiper-navigation-color": "#ee3239",
        "--swiper-navigation-size": "30px",
        "--swiper-navigation-sides-offset": "0px",
        // "--swiper-pagination-top": "380px",
      }}
    >
      {featured.map((value, index) => (
        <SwiperSlide key={index} className='p-2 pb-4'>
          <ProductCard data={value} isSparepart={false}/>
        </SwiperSlide>
      ))}
    </Swiper>
      <div className=" left-1/2 z-10 flex justify-center md:gap-4 gap-2">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`w-10 md:h-2 h-1.5 rounded-none transition-all duration-300 ${
              realIndex === index ? 'bg-primary scale-125' : 'bg-secondary-foreground'
            }`}
          ></button>
        ))}
      </div>
      </>
  );
}
