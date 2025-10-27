"use client"

import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Card, CardContent } from './card';


import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Captions from "yet-another-react-lightbox/plugins/captions";
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import "yet-another-react-lightbox/plugins/captions.css";
import { LazyImageCustom } from '../lazyImageCustom';
import { FilesProp } from '@/app/types';


type PropType = {
  cover: FilesProp
  image_catalogues: FilesProp[]
}

const SwiperCarouselOneProduct: React.FC<PropType> = (props) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const { cover, image_catalogues } = props
  const swiperRef = useRef<SwiperClass | null>(null);
  const [realIndex, setRealIndex] = useState(0);

  return (
    <>
      <Swiper
          style={{
            //@ts-ignore
            "--swiper-navigation-color": "#ee3239",
            "--swiper-navigation-size": "30px",
            "--swiper-navigation-sides-offset": "0px"
          }}
          loop={true}
          spaceBetween={0}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            const indexAttr = swiper.slides[swiper.activeIndex]?.getAttribute('data-swiper-slide-index');
            const real = indexAttr ? parseInt(indexAttr) : 0;
            setRealIndex(real);
          }}
          navigation={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2 h-full"
        >
              {/* {image_catalogues && image_catalogues.length > 0 && image_catalogues.map((item, index) => (
                catalogues_alt[index] === 'Top' &&
                  <SwiperSlide key={alt.concat(" - Catalogues - ", index.toString())}>
                    <div className="h-full flex justify-center items-center cursor-pointer"
                    onClick={() => openLightbox(index + 1)}>
                      <Card className="border-none h-full w-full flex items-center justify-center bg-transparent hover:bg-secondary">
                        <CardContent className="p-6 flex items-center justify-center w-full h-full">
                          <div className="relative overflow-hidden flex items-center justify-center h-[200px] w-full">
                              <LazyImageCustom
                                src={item.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item}` : item} 
                                alt={alt.concat(" - Catalogues - ", index.toString())} 
                                width={500}
                                height={500}
                                classname="max-h-full max-w-full object-contain"
                                lazy={true}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                  </SwiperSlide>
              ))} */}
              {cover && 
                  <SwiperSlide>
                    <div className="h-full flex justify-center items-center cursor-pointer"
                    onClick={() => openLightbox(0)}>
                      <Card className="border-none h-full w-full flex items-center justify-center bg-transparent hover:bg-secondary">
                        <CardContent className="p-6 flex items-center justify-center w-full h-full">
                          <div className="relative overflow-hidden flex items-center justify-center h-[200px] w-full">
                              <LazyImageCustom
                                src={cover.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover.url}` : cover.url} 
                                alt={cover.name} 
                                width={500}
                                height={500}
                                classname="max-h-full max-w-full object-contain"
                                lazy={true}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                  </SwiperSlide>
              }
              {image_catalogues && image_catalogues.length > 0 && image_catalogues.map((item, index) => (
                // catalogues_alt[index] !== 'Top' &&
                  <SwiperSlide key={`${item.name} - ${index.toString()}`}>
                    <div className="h-full flex justify-center items-center cursor-pointer"
                    onClick={() => openLightbox(index + 1)}>
                      <Card className="border-none h-full w-full flex items-center justify-center bg-transparent hover:bg-secondary">
                        <CardContent className="p-6 flex items-center justify-center w-full h-full">
                          <div className="relative overflow-hidden flex items-center justify-center h-[200px] w-full">
                              <LazyImageCustom
                                src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                                alt={`${item.name} - ${index.toString()}`} 
                                width={500}
                                height={500}
                                classname="max-h-full max-w-full object-contain"
                                lazy={true}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                  </SwiperSlide>
              ))}
        </Swiper>


      <div className="z-10 gap-2 flex justify-center items-center pt-2">
        <button
          key={0}
          onClick={() => swiperRef.current?.slideToLoop(0)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            realIndex === 0 ? 'bg-primary scale-125' : 'bg-secondary-foreground'
          }`}
        ></button>
        {image_catalogues.map((_, index) => (
          <button
            key={index+1}
            onClick={() => swiperRef.current?.slideToLoop(index+1)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              realIndex === index+1 ? 'bg-primary scale-125' : 'bg-secondary-foreground'
            }`}
          ></button>
        ))}
      </div>

      {/* </div> */}
      {image_catalogues && image_catalogues.length > 0 ?
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides=
          {[
            { 
              src: cover.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover.url}` : cover.url, 
              title: cover.name, 
              alt: cover.name 
            },
            ...image_catalogues.map((item, index) => ({ 
              src: item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url, 
              title: `${item.name} - ${index.toString()}`, 
              alt: `${item.name} - ${index.toString()}`
            }))
          ]}
          plugins={[Zoom, Thumbnails, Captions]}
        />
        :
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={[{ 
            src: cover.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover.url}` : cover.url, 
            title: cover.name, 
            alt: cover.name 
          }]}
          plugins={[Zoom, Captions]}
        />
      }
    </>
  );
}

export default SwiperCarouselOneProduct
