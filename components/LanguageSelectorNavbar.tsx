'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image';
import { Check, ChevronDown, Loader } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import getOneNewsLocaleSlug from '@/app/actions/get-one-news-locale-slug';
import { useLocale } from 'next-intl';
type Locale = "id" | "en"

interface LocaleOption {
  value: Locale
  label: string
}
const LanguageSelectorNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>("id")
  const [loading, setLoading] = useState<boolean>(true)
  const searchParams = useSearchParams();
  const locale = useLocale()

  useEffect(() => {
      const validLangs = ['en', 'id'];
      const storedLang = localStorage.getItem('selectedLanguage');
      const currentLang = pathname.split('/')[1];

      if (validLangs.includes(currentLang) && currentLang !== storedLang) {
        localStorage.setItem('selectedLanguage', currentLang);
      }
      if (currentLang === "en") {
        setCurrentLocale("en")
      } else {
        setCurrentLocale("id")
      }
      setLoading(false)
  }, []);

  // const selectLanguage = (lang: string) => {
  //   lang === 'en' || lang === 'id' &&
  //     localStorage.setItem('selectedLanguage', lang);
  //     setTimeout(() => {
  //       const segments = pathname.split('/');
  //       segments[1] = lang; // Replace the language code
  //       const newPath = segments.join('/') || '/';
  //       const currentParams = searchParams.toString();
  //       const fullPath = currentParams ? `${newPath}?${currentParams}` : newPath;
  //       router.replace(fullPath);
  //     }, 100);
  // };


  const selectLanguage = (lang: string) => {
  if (lang !== 'en' && lang !== 'id') return;
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
};

  const localeOptions: LocaleOption[] = [
    { value: "en", label: "EN" },
    { value: "id", label: "ID" },
  ]

  // Render flag based on locale
  const renderFlag = (locale: Locale) => {
    if (locale === "en") {
      return (
        <Image src="/images/acr/uk-flag.svg" alt="English Flag" width={50} height={50} className="w-auto h-5" />
      )
    } else {
      return (
        <Image src="/images/acr/indo-flag.svg" alt="Indonesian Flag" width={50} height={50} className="w-auto h-5" />
      )
    }
  }




  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
      {!loading ? (
        <>
          {renderFlag(currentLocale)}
          <span className="font-normal flex items-center justify-center text-sm">
            {currentLocale.toUpperCase()}
            <ChevronDown className="h-4 w-4" />
          </span>
        </>
        )
      :
        <Loader className='animate-spin h-4 w-4' />
      }
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {localeOptions.map((option) => (
          <div key={option.value} onClick={() => selectLanguage(option.value)}>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex items-center gap-1">
                {renderFlag(option.value)}
                <span className="font-normal text-sm">{option.label}</span>
                {currentLocale === option.value && <Check className="h-4 w-4 ml-2" />}
              </div>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelectorNavbar;
