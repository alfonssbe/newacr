"use client"

import getOneNewsLocaleSlug from "@/app/actions/get-one-news-locale-slug";
import { useLocale } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LanguageSelectorMobileFooter = ({ indo, eng }: { indo: string; eng: string; }) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams();
    const locale = useLocale()

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
      };
    return(
        <div className="flex items-center justify-center text-background">
            <div className="flex border rounded-lg">
                <div className="border-r flex gap-2 items-center justify-center p-4 hover:cursor-pointer" onClick={() => selectLanguage('id')}>
                    <Image src="/images/acr/indo-flag.svg" alt="Indonesian Flag" width={50} height={50} className="w-auto h-6" />
                    <div className={`${locale === 'id' ? 'opacity-100 font-bold' : 'opacity-70'}`}>{indo}</div>
                </div>
                <div className="flex gap-2 items-center justify-center p-4 hover:cursor-pointer" onClick={() => selectLanguage('en')}>
                    <Image src="/images/acr/uk-flag.svg" alt="English Flag" width={50} height={50} className="w-auto h-6" />
                    <div className={`${locale === 'en' ? 'opacity-100 font-bold' : 'opacity-70'}`}>{eng}</div>
                </div>
            </div>
        </div>
    )
};

export default LanguageSelectorMobileFooter;