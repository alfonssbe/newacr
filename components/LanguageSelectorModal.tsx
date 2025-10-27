'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import getOneNewsLocaleSlug from '@/app/actions/get-one-news-locale-slug';

const LanguageSelectorModal = () => {
  const t = useTranslations('Language Selector');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale()

  useEffect(() => {
      const validLangs = ['en', 'id'];
      const storedLang = localStorage.getItem('selectedLanguage');
      const currentLang = pathname.split('/')[1];

      if (!storedLang) {
        setShowModal(true);
      } else {
        if (validLangs.includes(currentLang) && currentLang !== storedLang) {
          localStorage.setItem('selectedLanguage', currentLang);
        }
      }
  }, []);

  const selectLanguage = (lang: 'en' | 'id') => {
  if (locale !== lang)
    {
      setTimeout(async() => {
        const segments = pathname.split('/');
        const currentParams = searchParams.toString();

        //FOR NEWS
        if(segments.length === 3 && (segments[1] === 'berita' || segments[1] === 'news')) {
          segments[2] = await getOneNewsLocaleSlug(segments[2], 'id')
        }
        if(segments.length === 4 && (segments[2] === 'berita' || segments[2] === 'news')){
          segments[3] = await getOneNewsLocaleSlug(segments[3], 'en')
        }
        
        let newPath = '';

        if (lang === 'en') {
          if (segments[1] !== 'en') {
            segments.splice(1, 0, 'en');
          }
          newPath = segments.join('/');
        }

        if (lang === 'id') {
          if (segments[1] === 'en') {
            segments.splice(1, 1);
          }
          newPath = segments.join('/') || '/';
        }

        const fullPath = currentParams ? `${newPath}?${currentParams}` : newPath;
        router.replace(fullPath);
      }, 100);
    }
    localStorage.setItem('selectedLanguage', lang);
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        {/* <Globe size={20}/> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className='flex items-center justify-center'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className='flex gap-4 items-center justify-center'>
          <Button variant="outline" className="h-fit w-full" onClick={() => selectLanguage('id')}>
            <div className="block">
              <div className='flex items-center justify-center'>
                <Image src="/images/acr/indo-flag.svg" alt="Indonesian Flag" width={50} height={50} className="w-auto h-8" />
              </div>
              <div>Indonesia</div>
            </div>
          </Button>
          <Button variant="outline" className="h-fit w-full" onClick={() => selectLanguage('en')}>
            <div className="block">
              <div className='flex items-center justify-center'>
                <Image src="/images/acr/uk-flag.svg" alt="English Flag" width={50} height={50} className="w-auto h-8" />
              </div>
              <div>English</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectorModal;
