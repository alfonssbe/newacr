"use client"

import { Hero } from '@/app/types';
import SwiperCarousel from '@/app/[lang]/components/ui/swipercarousel';

import { useEffect, useState } from 'react';
import getAllHero from '@/app/actions/get-all-hero';
import FullScreenLoader from '../loadingNoScroll';
import { useLocale } from 'next-intl';

const HeroSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<Hero[]>([]);
  const lang = useLocale()

  useEffect(() => {
    async function fetchData() {
      try {
        const heroData: Hero[] = await getAllHero(lang);
        setValue(heroData);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    loading? 
      <FullScreenLoader isVisible={loading}/>
      :
    <>
      <h2 className="sr-only">{lang === 'id' ? 'Keluaran Terbaru' : 'New Releases'}</h2>
      <SwiperCarousel slides={value}/>
    </>  
  )
};

export default HeroSection;
