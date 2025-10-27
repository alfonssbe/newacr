"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { LazyImage } from "./lazyImage";
import { useEffect, useRef, useState } from "react";
import { Searchbox } from "@/app/types";

import { Loader, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import getProductsForSearchbox from "@/app/actions/get-product-for-searchbox";
import { LazyImageCustom } from "./lazyImageCustom";

export default function SearchBoxMain() {
    const t = useTranslations('Navbar');
    const [activeSearch, setactiveSearch] = useState<string>('');
    const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
    const [finalProductSearchbox, setFinalProductSearchbox] = useState<Searchbox[]>([]);
    const [searchBoxOpen, setSearchBoxOpen] = useState<boolean>(true)
    const [searchBarDisabled, setSearchBarDisabled] = useState<boolean>(true)
    const inputRef = useRef<HTMLInputElement>(null);
    const locale = useLocale()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data : Searchbox[] = await getProductsForSearchbox();
                setFinalProductSearchbox(data);
                setSearchBarDisabled(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


  function searchData(val: string){
    let select : Searchbox[] = []
    
    const updatedVal = val.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, ' inch');
    const trimmedValue = updatedVal.trimStart().toLowerCase();
    finalProductSearchbox.map((value)=>{
      value.value.toLowerCase().includes(trimmedValue)?
        select.push(value)
        :
        ''
    })
    setfoundProducts(select)
  }
  

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSearchBoxOpen(false)
      setactiveSearch('')
    }
  };

  // Adding event listeners on mount and cleaning up on unmount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  
      useEffect(() => {
      if (searchBoxOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [searchBoxOpen]);
  
    return(
        searchBoxOpen && 
        <div className="fixed top-0 left-0 w-screen h-screen bg-foreground backdrop-blur-xs z-101 py-8">
          <div className="container mx-auto h-full items-center px-10 xl:px-24 lg:px-16 overflow-y-auto">
          <div className="grid grid-cols-3">
            {/* Menu - Left */}
            <div className="flex justify-start">
            </div>

            {/* Logo - Center */}
            <div className="flex justify-center">
              <Link
                href={locale === 'id' ? '/' : `/${locale}`}
                onClick={() => {
                  setSearchBoxOpen(false);
                  setactiveSearch('');
                }}
                className="flex items-center justify-center"
              >
                <Image
                  src="/images/acr/logo_acr.webp"
                  alt="ACR Speaker Logo"
                  width={1000}
                  height={1000}
                  priority
                  className="max-w-[100px] h-fit object-contain cursor-pointer"
                />
              </Link>
            </div>

            {/* Close - Right */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSearchBoxOpen(false);
                  setactiveSearch('');
                }}
                className="p-2 text-foreground/60 hover:text-foreground transition-colors bg-transparent hover:bg-transparent"
              >
                <X className="p-1 border rounded-lg w-8 h-8 text-background hover:text-primary hover:border-primary"/>
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>


        <div className="md:mt-14 mt-10">
          <div className="relative w-full">
            <Input 
              type="text" 
              placeholder={searchBarDisabled ? '' :t('search')} 
              className="w-full mt-8 text-background" 
              ref={inputRef} 
              onChange={(event) =>
                (
                  setactiveSearch(event.target.value),
                  searchData(event.target.value)
                )
              }
              value={activeSearch}
              disabled={searchBarDisabled}/>

              {searchBarDisabled && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ">
                  <Loader
                    className="animate-spin"
                  />
                </div>
              )}
              {!searchBarDisabled && activeSearch === '' && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4">
                  <Search className="h-4 w-4" />
                  </div>
              )}
            </div>
        </div>
        
        <div className={`${activeSearch.trim() === "" ? 'hidden' : 'block relative z-50 w-full mx-auto overflow-y-scroll max-h-3/5 border rounded-lg bg-secondary-foreground'}`}>
          <div>
            <div className={`overflow-y-auto`}> 
              {foundProducts.length!=0?
                foundProducts.map((value) => (
                  <Link 
                    key={value.label} 
                    href={locale === 'id' ? `/produk/${value.slug}` : `/${locale}/products/${value.slug}`} 
                    onClick={() => {
                      setactiveSearch("");
                      setSearchBoxOpen(false)
                    }}
                    className="border-0 block cursor-pointer"
                    >                 
                      <div className="text-background py-4 p-2 flex items-center border-b hover:text-primary hover:font-bold">
                        <div className="pr-4 max-w-[100px] h-auto">
                          <LazyImage
                            src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url} 
                            alt={value.label} 
                            width={100} 
                            height={100} 
                          />
                        </div>
                          <div className="flex w-full h-full">
                            <div className="flex flex-col h-full justify-center items-start">
                              <div className="flex items-start justify-start">
                                <LazyImageCustom
                                  src={`/images/acr/series_logo/${
                                    value.categoryDetails.toLowerCase().includes("black magic") ? "acr_black_bg.webp"
                                    : value.categoryDetails.toLowerCase().includes("black") ? "acr_black_bg.webp"
                                    : value.categoryDetails.toLowerCase().includes("premier") ? "premier_black_bg.webp"
                                    : value.categoryDetails.toLowerCase().includes("excellent") ? "excellent_black_bg.webp"
                                    : value.categoryDetails.toLowerCase().includes("deluxe") ? "deluxe_black_bg.webp"
                                    : value.categoryDetails.toLowerCase().includes("classic") ? "acr_black_bg.webp"
                                    : value.categoryDetails.toLowerCase().includes("fabulous") ? "fabulous_black_bg.webp"
                                    : value.categoryDetails.toLowerCase().includes("pro") ? "acr_black_bg.webp"
                                    : value.label.toLowerCase().includes("desibel") ? "desibel_black_bg.webp"
                                    : value.label.toLowerCase().includes("curve") ? "curve_black_bg.webp"
                                    : "acr_black_bg.webp"
                                  }`}
                                  alt="Logo"
                                  width={250}
                                  height={250}
                                  // classname="max-w-[120px] min-w-[100px] h-fit object-contain"
                                  classname="max-h-[20px] min-h-[8px] w-auto object-contain self-start"
                                  lazy={false}
                                />
                              </div>
                              <div className="flex flex-col justify-center md:text-lg text-base font-bold pt-2 pb-1">
                                {value.label}
                              </div>
                              <div className="text-sm font-light line-clamp-1">
                                {value.categoryDetails}
                              </div>
                            </div>
                          </div>
                      </div>
                  </Link>
                ))
                :
                <div>                          
                  <div className="p-4 flex justify-center items-center border-b-2 border-gray-100">
                    <div className="text-sm text-background">
                      {t('search-not-found')}
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="pt-8">
          <Button asChild variant={"default"} className="w-full rounded-full font-bold" onClick={ () =>
              setSearchBoxOpen(false)}>
            <Link href={locale === 'id' ? '/driver' : `/${locale}/drivers`}>{t('view-all-product')}</Link>
          </Button>
        </div>
        </div>
      </div>
    )
}