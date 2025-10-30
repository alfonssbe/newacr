"use client";

import { activeCheckbox, activeSlider, CheckBoxData, AllFilterProductsOnlyType, Searchbox, SliderData } from "@/app/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/app/[lang]/components/ui/sheet";
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import ProductCard from "@/app/[lang]/components/ui/product-card";
import { Loader, Search } from "lucide-react"
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/app/[lang]/components/ui/breadcrumb";
import { LazyImage } from "@/app/[lang]/components/lazyImage";
import { Fragment, useEffect, useRef, useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useMediaQuery } from "@/components/hooks/use-media-query";
import { useLocale, useTranslations } from "next-intl";
import getSubCatNameBySlug from "@/app/actions/get-SubCat_Name";
import getSubSubCatNameBySlug from "@/app/actions/get-SubSubCat_Name";
import getSeriesNameBySlug from "@/app/actions/get-Series_Name";
import { LazyImageCustom } from "@/app/[lang]/components/lazyImageCustom";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Slider } from "@/app/[lang]/components/ui/slider";


type SliderSheetValue = {
    slug: string;
    value: {
      min: number;
      max: number;
    };
  };

interface MainProps {
  data: (AllFilterProductsOnlyType)[];
  slider: (SliderData)[]
  checkbox: (CheckBoxData)[]
  showFilters: (boolean)
};

const AllDriversandFiltersProducts: React.FC<MainProps> = ({
  data, slider, checkbox, showFilters
}) => {
    const t = useTranslations('All Filters');
    const [allActiveSlider, setAllActiveSlider] = useState<activeSlider[]>([])  
    const [allActiveCheckbox, setAllActiveCheckbox] = useState<activeCheckbox[]>([])  
    const [defaultSliderSheet, setdefaultSliderSheet] = useState<SliderSheetValue[]>([])  
    const [sheetOpenedForSlider, setSheetOpenedForSlider] = useState<boolean>(false)  
    const [reseted, setReseted] = useState<string>('false')
    const [isLgScreen, setIsLgScreen] = useState(false);
    const [allFeaturedProducts, setAllFeaturedProducts] = useState<AllFilterProductsOnlyType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [finalPathname, setfinalPathname] = useState<string[]>([])

    const pathname = usePathname()
    const segmentedPathname = pathname.split(('/'))
    if (segmentedPathname[1] !== 'en') {
    segmentedPathname.splice(1, 0, 'id');
    }
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // or whatever number of items per page you want
    const isMobile = useMediaQuery("(max-width: 640px)")

    const locale = useLocale()

    const [activeSearch, setactiveSearch] = useState<string>('');
    const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
    const [finalProductSearchbox, setFinalProductSearchbox] = useState<Searchbox[]>([]);
    const [searchBoxOpen, setSearchBoxOpen] = useState<boolean>(true)
    const [searchBarDisabled, setSearchBarDisabled] = useState<boolean>(true)
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [sliderValue, setSliderValue] = useState<SliderData[]>([])
    const [loadingSlider, setLoadingSlider] = useState<boolean>(true)

    useEffect(() => {
        const fetchDataSlider = async () => {
            try {
                let tempSlider: SliderData[] = []
                slider.map((value) => {
                    tempSlider.push({
                        slug: value.slug,
                        name: value.name,
                        minIndex: value.minIndex,
                        maxIndex: value.maxIndex,
                        min_index: value.min_index,
                        max_index: value.max_index,
                        unit: value.unit,
                        value: value.value
                    })
                });
                setSliderValue(tempSlider)
                setLoadingSlider(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataSlider();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (
            wrapperRef.current &&
            !wrapperRef.current.contains(event.target as Node)
        ) {
            setactiveSearch(""); // clear when clicked outside
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
    useEffect(() => {
        const fetchDataSearchbox = async () => {
            try {
                let data_Final : Searchbox[] = []
                data.map((value: AllFilterProductsOnlyType) => {
                    
                    let tempName = ""
                    value.products.allCat && value.products.allCat.length > 0 && value.products.allCat.map((valCat) => {
                        tempName += valCat.name + " ";
                    })

                    const normalizedStr = value.products.name.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, ' inch');
                    let combined_val = normalizedStr.concat(" ", tempName)


                    const hasValidSize = value.size.value !== '' && value.size.name !== "-";
                    const seriesName = value.products.allCat.find(cat => cat.type === 'Series')?.name;
                    let finalDesc = '';
                    if (hasValidSize) {
                        finalDesc += `${value.size.value.toString()} inch`;
                    }
                    if (hasValidSize && seriesName) {
                        finalDesc += ' - ';
                    }
                    if (seriesName) {
                        finalDesc += `${seriesName} Series`;
                    }

                    data_Final.push({
                        value: combined_val,
                        label: value.products.name,
                        slug: value.products.slug,
                        url: value.products.cover_img.url,
                        categoryDetails: finalDesc
                    })
                })
                data_Final.length > 0 && data_Final.sort((a, b) => a.value.localeCompare(b.value))
                setFinalProductSearchbox(data_Final);
                setSearchBarDisabled(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataSearchbox();
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







    const totalPages = Math.ceil(allFeaturedProducts.length / itemsPerPage);

    const paginatedItems = allFeaturedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
    );

    const getPageNumbers = () => {
        const pageNumbers = []
    
        // Always show first page
        pageNumbers.push(1)
    
        // Calculate range around current page
        // Show fewer pages on mobile
        const offset = isMobile ? 0 : 1
        const leftSide = Math.max(2, currentPage - offset)
        const rightSide = Math.min(totalPages - 1, currentPage + offset)
    
        // Add ellipsis after first page if needed
        if (leftSide > 2) {
          pageNumbers.push("ellipsis-1")
        }
    
        // Add pages around current page
        for (let i = leftSide; i <= rightSide; i++) {
          if (i !== 1 && i !== totalPages) {
            pageNumbers.push(i)
          }
        }
    
        // Add ellipsis before last page if needed
        if (rightSide < totalPages - 1) {
          pageNumbers.push("ellipsis-2")
        }
    
        // Always show last page
        if (totalPages > 1) {
          pageNumbers.push(totalPages)
        }
    
        return pageNumbers
      }

    
    useEffect(() => {
        if (reseted === 'true') {
            setAllActiveCheckbox([]);
            setAllActiveSlider([]);
          
            let tempslider = sliderValue
            tempslider.map((value) => {
                value.minIndex = value.min_index
                value.maxIndex = value.max_index
            })
            setSliderValue(tempslider)

            setReseted('false');
        }
    }, [reseted]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const handleResize = (e: MediaQueryListEvent) => {
          setIsLgScreen(e.matches);
        //   setAllActiveSlider(allActiveSlider)
          setSheetOpenedForSlider(true)
        };
    
        // Set initial value
        setIsLgScreen(mediaQuery.matches);
    
        // Add event listener
        mediaQuery.addEventListener('change', handleResize);
    
        // Cleanup listener on unmount
        return () => {
          mediaQuery.removeEventListener('change', handleResize);
        };
    }, [allActiveSlider]);

    useEffect(() => {
        const fetchData = () => {
            try {
                let sliderTemp: SliderSheetValue[] = []
                allActiveSlider.map((value) => {
                    sliderTemp.push({
                        slug: value.slug,
                        value:{
                            min: value.bottomVal,
                            max: value.topVal
                        }
                    })
                })
                setdefaultSliderSheet(sliderTemp)
                setSheetOpenedForSlider(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [sheetOpenedForSlider, allActiveSlider]); 

    useEffect(() => {
        const fetchData = async () => {
          try {
            let finishedSliderProducts: AllFilterProductsOnlyType[] = []
            let finishedCheckboxProducts: AllFilterProductsOnlyType[] = []
            let tempShowed: AllFilterProductsOnlyType[][] = [];
            if (allActiveSlider.length !== 0) {
                allActiveSlider.forEach((slider, indexslider) => {
                    if (!tempShowed[indexslider]) {
                        tempShowed[indexslider] = [];
                    }
                    if (indexslider === 0) {
                        data.forEach((product) => {
                            let productValue = 0
                            if(slider.slug==='size'){
                                productValue = Number(product.size.value)
                            }
                            else{
                                productValue = Number(product.specs.find((val) => val.slugEnglish === slider.slug)?.value);
                            }
                            const bottomValue = Number(slider.bottomRealVal);
                            const topValue = Number(slider.topRealVal);
            
                            if (bottomValue <= productValue && topValue >= productValue) {
                                tempShowed[indexslider].push(product);
                            }
                        });
                    } else {
                        tempShowed[indexslider - 1].forEach((product) => {
                            let productValue = 0
                            if(slider.slug==='size'){
                                productValue = Number(product.size.value)
                            }
                            else{
                                productValue = Number(product.specs.find((val) => val.slugEnglish === slider.slug)?.value);
                            }
                            const bottomValue = Number(slider.bottomRealVal);
                            const topValue = Number(slider.topRealVal);
            
                            if (bottomValue <= productValue && topValue >= productValue) {
                                tempShowed[indexslider].push(product);
                            }
                        });
                    }
                });
                finishedSliderProducts = tempShowed[allActiveSlider.length - 1]
            } else {
                finishedSliderProducts = data
            }

            if (allActiveCheckbox.length !== 0) {
                let finalTempProduct: Record<string, AllFilterProductsOnlyType[]> = {};
                let checkboxCategories: string[] = [];

                allActiveCheckbox.forEach((checkbox) => {
                    const category = checkbox.slug;
                    !checkboxCategories.includes(category)?
                        checkboxCategories.push(category)
                    :
                        null

                    if (!finalTempProduct[category]) {
                        finalTempProduct[category] = [];
                    }


                    data.forEach((product) => {
                        let productValue = undefined
                        if(checkbox.slug === 'series'){
                            productValue = product.products.allCat.find((val) => val.type === 'Sub Category' && val.name.toLowerCase() === checkbox.name.toLowerCase())?.name ?? undefined;
                        }
                        else if(checkbox.slug === 'type'){
                            productValue = product.products.allCat.find((val) => val.type === 'Sub Sub Category' && val.name.toLowerCase() === checkbox.name.toLowerCase())?.name ?? undefined;
                        }
                        else if(checkbox.slug === 'acr-series'){
                            productValue = product.products.allCat.find((val) => val.type === 'Series' && val.name.toLowerCase() === checkbox.name.toLowerCase())?.name ?? undefined;
                        }

                        if (productValue != undefined) {
                            const productExists = finalTempProduct[category].some(item => item.products.name === product.products.name);
                            if (!productExists) {
                                finalTempProduct[category].push(product);
                            }
                        }
                    });
                });

                

                let tempFinished: AllFilterProductsOnlyType[] = [];
                let productCountMap = new Map<string, number>();

                checkboxCategories.map((category, indexcategory) => {
                    finalTempProduct[category].map((product) => {
                        tempFinished.push(product);
                        const count = productCountMap.get(product.products.name) || 0;
                        productCountMap.set(product.products.name, count + 1);
                    });
                });

                productCountMap.forEach((count, productName) => {
                    if (count === checkboxCategories.length) {
                        const product = tempFinished.find(p => p.products.name === productName);
                        if (product) {
                            finishedCheckboxProducts.push(product);
                        }
                    }
                });
            }
            else{
                finishedCheckboxProducts = data
            }

            let FinalFeatured: AllFilterProductsOnlyType[] = []
            for (const checkboxproducts of finishedCheckboxProducts) {
                for (const sliderproducts of finishedSliderProducts) {
                    if(checkboxproducts.products.name === sliderproducts.products.name){
                        FinalFeatured.push(sliderproducts)
                        break
                    }
                }
            }
            FinalFeatured.sort((a, b) => a.products.name.localeCompare(b.products.name));

            setAllFeaturedProducts(FinalFeatured)
            setLoading(false)

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [data, allActiveSlider, allActiveCheckbox]); 


      useEffect(() => {
        const fetchData = async () => {
          try {
            let temppathname: string[] = [];
      
            for (let index = 0; index < segmentedPathname.length; index++) {
              const value = segmentedPathname[index];              
      
              if (index < 2) {
                temppathname.push(value);
              } else if (index === 2) {
                const word = segmentedPathname[index];
                const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
                temppathname.push(capitalized);
              } else if (index === 3) {
                if(value.toLowerCase() === 'acr' || value.toLowerCase() === 'desibel' || value.toLowerCase() === 'curve'){
                    let temp = await getSubCatNameBySlug(value);
                    temppathname.push(temp?.name || "");
                }
                else{
                    let temp = await getSubSubCatNameBySlug(value);
                    temppathname.push(temp?.name || "");
                }
              } else if (index === 4) {
                if (segmentedPathname[index - 1].toLowerCase() === "acr") {
                  let temp = await getSeriesNameBySlug(value);
                  temppathname.push(temp?.name || "");
                } else {
                  let temp = await getSubSubCatNameBySlug(value);
                  temppathname.push(temp?.name || "");
                }
              } else {
                let temp = await getSubSubCatNameBySlug(value);
                temppathname.push(temp?.name || "");
              }
            }
      
            setfinalPathname(temppathname);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [pathname]);



    const handleSliderChange = (slug: string, value: number[], min_index: number, max_index: number, allVal: number[], parentName: string, unit: string, index: number) => {
        // setSliderValue((prev) => ({
        // ...prev,
        // minIndex: value[0],
        // maxIndex: value[1],
        // }))
        let tempslider = sliderValue
        tempslider[index].minIndex = value[0]
        tempslider[index].maxIndex = value[1]
        setSliderValue(tempslider)

        let tempactiveSlider : activeSlider[] = []
        let sliderisActive : boolean = false
        if(allActiveSlider.length!= 0){
          allActiveSlider.map((valueactiveSlider) => {
            if(valueactiveSlider.slug === slug){
                sliderisActive = true
                if(value[0] === min_index && value[1] === max_index){

                }
                else if(value[0] !== min_index || value[1] !== max_index){
                    tempactiveSlider.push({
                    slug,
                    bottomVal: value[0],
                    topVal: value[1],
                    bottomRealVal: allVal[value[0]],
                    topRealVal: allVal[value[1]],
                    parentName,
                    unit
                    })
                }
            }
            else{
              tempactiveSlider.push(valueactiveSlider)
            }
          })
        }
        else{
            sliderisActive = true
            if(value[0] !== min_index || value[1] !== max_index){
                tempactiveSlider.push({
                slug,
                bottomVal: value[0],
                topVal: value[1],
                bottomRealVal: allVal[value[0]],
                topRealVal: allVal[value[1]],
                parentName,
                unit
                })
            }
        }
        if(!sliderisActive){
            tempactiveSlider.push({
                slug,
                bottomVal: value[0],
                topVal: value[1],
                bottomRealVal: allVal[value[0]],
                topRealVal: allVal[value[1]],
                parentName,
                unit
            })
        }
        setAllActiveSlider(tempactiveSlider)
      };

    const handleCheckboxChange = (slug: string, name: string, unit: string, parentName: string) => {
        if(name!==''){
            let tempactiveCheckbox: activeCheckbox[] = [...allActiveCheckbox];
            const index = tempactiveCheckbox.findIndex(item => item.name === name);
        
            if (index !== -1) {
                tempactiveCheckbox.splice(index, 1);
            } else {
                let temp: activeCheckbox = {
                    slug,
                    name,
                    unit,
                    parentName
                };
                tempactiveCheckbox.push(temp);
            }
        
            setAllActiveCheckbox(tempactiveCheckbox);
        }
    };


    return ( 
        <>

            <div className="pb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                    {finalPathname.map((value, index) => {
                        let path = '/' + segmentedPathname.slice(1, index + 1).join('/');

                        return index !== segmentedPathname.length - 1 ? (
                            index !== 1 && (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={
                                            index === 0 ? 
                                                locale === 'id' ?    
                                                    '/'
                                                :
                                                    `/${locale}` 
                                            : 
                                                locale === 'id' ?
                                                    path
                                                :
                                                    `${path}`}>
                                            {index === 0 ? 'Home' : value.charAt(0).toUpperCase() + value.slice(1)}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                </Fragment>
                            )
                        ) : (
                            <Fragment key={index}>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{value.charAt(0).toUpperCase() + value.slice(1)}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </Fragment>
                        );
                    })}

                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* <SliderSheetExample/> */}

        <div className='block lg:hidden text-center pb-4'>
            {/* TOMBOL MOBILE UNTUK FILTERS & PERBANDINGAN */}





        <div className="w-full">
            <div className="relative w-full">
                <Input 
                    type="text" 
                    placeholder={searchBarDisabled ? '' :t('search')} 
                    className="w-full text-foreground active:border-none focus-visible:outline-primary focus-visible:ring-transparent bg-secondary" 
                    ref={inputRef} 
                    onChange={(event) =>
                        (
                        setactiveSearch(event.target.value),
                        searchData(event.target.value)
                        )
                    }
                    value={activeSearch}
                    disabled={searchBarDisabled}
                />
            {/* </div> */}

            {searchBarDisabled && (
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 text-muted-foreground ">
                    <Loader className="animate-spin"/>
                </div>
            )}
                {!searchBarDisabled && activeSearch === '' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4">
                    <Search className="h-4 w-4" />
                    </div>
                )}
            </div>

            <div className="pb-4">
            <div className={`${activeSearch.trim() === "" ? 'hidden' : 'block z-50 overflow-y-scroll scrollbar-thin scrollbar-corner-secondary-foreground max-h-[400px] w-full border rounded-lg bg-background'}`}>
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
                        className="border-0 block cursor-pointer bg-background hover:bg-secondary"
                        >                 
                        <div className="text-foreground py-4 p-2 flex items-center border-b hover:text-primary hover:font-bold">
                            <div className="pr-4 min-w-[70px] max-w-[80px] h-auto">
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
                                        value.categoryDetails.toLowerCase().includes("black magic") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("black") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("premier") ? "premier_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("excellent") ? "excellent_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("deluxe") ? "deluxe_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("classic") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("fabulous") ? "fabulous_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("pro") ? "acr_white_bg.webp"
                                        : value.label.toLowerCase().includes("desibel") ? "desibel_white_bg.webp"
                                        : value.label.toLowerCase().includes("curve") ? "curve_white_bg.webp"
                                        : "acr_white_bg.webp"
                                    }`}
                                    alt="Logo"
                                    width={250}
                                    height={250}
                                    // classname="max-w-[120px] min-w-[100px] h-fit object-contain"
                                    classname="max-h-[17px] min-h-[8px] w-auto object-contain self-start"
                                    lazy={false}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-start text-sm font-bold pt-2 pb-1">
                                    {value.label}
                                </div>
                                <div className="text-xs font-light text-start line-clamp-1">
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
                        <div className="text-sm text-foreground">
                        {t('search-not-found')}
                        </div>
                    </div>
                    </div>
                }
                </div>
            </div>
            </div>

        </div>







            <div className='pb-4'>
                <Sheet open={isLgScreen?false:undefined}>
                    <SheetTrigger asChild className="hover:cursor-pointer" onClick={() => setSheetOpenedForSlider(true)}>
                    <div className="w-full text-center font-bold text-lg bg-transparent p-2 rounded-lg text-foreground border-foreground border-4 hover:shadow-lg">
                       Edit Filters
                    </div>
                    </SheetTrigger>
                    <SheetContent side={'left'} className="w-full max-w-[300px] sm:max-w-[300px] bg-white px-2">
                    <SheetTitle/>
                    <SheetDescription/>
                    <SheetHeader>
                        <div className="text-lg lg:text-xl font-bold text-center pb-4 text-black">
                            FILTERS 
                        </div>
                    </SheetHeader>
                    {!loadingSlider && Array.isArray(sliderValue) &&
                        <ScrollArea className="h-full w-full pb-8 px-2">


        <div className="w-full px-2">
            <div className="relative w-full">
                <Input 
                    type="text" 
                    placeholder={searchBarDisabled ? '' :t('search')} 
                    className="w-full text-foreground active:border-none focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-transparent bg-secondary" 
                    ref={inputRef} 
                    onChange={(event) =>
                        (
                        setactiveSearch(event.target.value),
                        searchData(event.target.value)
                        )
                    }
                    value={activeSearch}
                    disabled={searchBarDisabled}
                />
            {/* </div> */}

                {searchBarDisabled && (
                    <div className="absolute left-1/2 top-0 translate-y-1/2 -translate-x-1/2 h-5 w-5 text-muted-foreground ">
                        <Loader className="animate-spin"/>
                    </div>
                )}
                {!searchBarDisabled && activeSearch === '' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4">
                    <Search className="h-4 w-4" />
                    </div>
                )}
            </div>

            <div className="pb-4">
            <div className={`${activeSearch.trim() === "" ? 'hidden' : 'block z-50 overflow-y-scroll scrollbar-thin scrollbar-corner-secondary-foreground max-h-[400px] w-full border rounded-lg bg-background'}`}>
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
                        className="border-0 block cursor-pointer bg-background hover:bg-secondary"
                        >                 
                        <div className="text-foreground py-4 p-2 flex items-center border-b hover:text-primary hover:font-bold">
                            <div className="pr-4 min-w-[70px] max-w-[80px] h-auto">
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
                                        value.categoryDetails.toLowerCase().includes("black magic") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("black") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("premier") ? "premier_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("excellent") ? "excellent_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("deluxe") ? "deluxe_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("classic") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("fabulous") ? "fabulous_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("pro") ? "acr_white_bg.webp"
                                        : value.label.toLowerCase().includes("desibel") ? "desibel_white_bg.webp"
                                        : value.label.toLowerCase().includes("curve") ? "curve_white_bg.webp"
                                        : "acr_white_bg.webp"
                                    }`}
                                    alt="Logo"
                                    width={250}
                                    height={250}
                                    // classname="max-w-[120px] min-w-[100px] h-fit object-contain"
                                    classname="max-h-[17px] min-h-[8px] w-auto object-contain self-start"
                                    lazy={false}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-start text-sm font-bold pt-2 pb-1">
                                    {value.label}
                                </div>
                                <div className="text-xs font-light text-start line-clamp-1">
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
                        <div className="text-sm text-foreground">
                        {t('search-not-found')}
                        </div>
                    </div>
                    </div>
                }
                </div>
            </div>
            </div>

        </div>



                        {checkbox.map((valueCheckbox, index) =>
                        valueCheckbox.value.length === 1 ? null : (
                            <div key={index} className="grid gap-2 w-full pt-2 px-2">
                            <div className="text-center font-bold text-sm text-black">{valueCheckbox.name}</div>
                            {valueCheckbox.value.map((choicesVal, indexChoices) => (
                                <div key={indexChoices} className="flex items-center py-1">
                                <div className="pr-2 flex items-center">
                                    <Checkbox
                                    id={choicesVal}
                                    checked={allActiveCheckbox.some((item) => item.name === choicesVal)}
                                    onClick={() => {handleCheckboxChange(valueCheckbox.slug, choicesVal, valueCheckbox.unit, valueCheckbox.name), setCurrentPage(1)}}
                                    />
                                </div>
                                <label htmlFor={choicesVal} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">
                                    {choicesVal} {valueCheckbox.unit}
                                </label>
                                </div>
                            ))}
                            <hr />
                            </div>
                        )
                        )}
                        
                        {sliderValue.map((sliderValue1, index) =>
                        sliderValue1.value.length > 1 && (
                        <div key={index} className="grid gap-2 w-full pt-2 px-2">
                        <div className="text-center font-bold text-sm text-black">
                            {sliderValue1.name}
                        </div>
                        {/* <Slider
                            // key={`slider-${value.slug}-${sheetOpenedForSlider}-${JSON.stringify(getCurrentSliderValue(value))}`}
                            max={value.max_index}
                            min={value.min_index}
                            step={1}
                            unit={value.unit}
                            value={value.value}
                            opensheetvalmin={
                                (defaultSliderSheet && defaultSliderSheet.find(tempVal => tempVal.slug === value.slug)?.value.min) ?? 0
                            }
                            opensheetvalmax={
                                (defaultSliderSheet && defaultSliderSheet.find(tempVal => tempVal.slug === value.slug)?.value.max) ?? 0
                            }
                            resetclicked={reseted}
                            onValueChange={(val) => {handleSliderChange(value.slug, val, value.min_index, value.max_index, value.value, value.name, value.unit), setCurrentPage(1)}}
                            className={cn("w-full py-2")}
                        /> */}
                        <Slider
                            value={[sliderValue1.minIndex, sliderValue1.maxIndex]}
                            max={sliderValue1.max_index}
                            min={sliderValue1.min_index}
                            step={1}
                            onValueChange={(val) => {
                            handleSliderChange(sliderValue1.slug, val, sliderValue1.min_index, sliderValue1.max_index, sliderValue1.value, sliderValue1.name, sliderValue1.unit, index)
                            setCurrentPage(1)
                            }}
                            unit={sliderValue1.unit}
                            dataArray={sliderValue1.value}
                            className={cn("w-full py-2")}
                        />
                        <hr/>
                    </div>
                        )
                        )}
                        <div className="w-full flex justify-center pt-4 px-2">
                            <Button onClick={() => {setReseted('true'), setCurrentPage(1)}} variant={"outline"} className="bg-transparent border-foreground border-4 w-full text-primary hover:border-primary hover:text-primary ">
                                <b>{t('all-filters-clear-filters')}</b>
                            </Button>
                        </div>
                    </ScrollArea>
                    }
                    </SheetContent>
                </Sheet>
                </div>

            </div>
            <div className="flex">
            {showFilters?
            <>
                <div className="hidden lg:block pb-4 pr-4 w-1/3">
                    <div className="sticky top-24 rounded-md text-black max-w-full">









        <div className="w-full">
            <div className="relative w-full">
                <Input 
                    type="text" 
                    placeholder={searchBarDisabled ? '' : t('search')} 
                    className="w-full text-foreground active:border-none focus-visible:outline-primary focus-visible:ring-transparent bg-secondary pr-8" // Add right padding
                    ref={inputRef} 
                    onChange={(event) => (
                    setactiveSearch(event.target.value),
                    searchData(event.target.value)
                    )}
                    value={activeSearch}
                    disabled={searchBarDisabled}
                />

                {searchBarDisabled && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
                    <Loader className="animate-spin" />
                    </div>
                )}

                {!searchBarDisabled && activeSearch === '' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4">
                    <Search className="h-4 w-4" />
                    </div>
                )}
            </div>


            <div className="pb-4">
            <div className={`${activeSearch.trim() === "" ? 'hidden' : 'block z-50 overflow-y-scroll scrollbar-thin scrollbar-corner-secondary-foreground max-h-[400px] w-full border rounded-lg bg-background'}`}>
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
                        className="border-0 block cursor-pointer bg-background hover:bg-secondary"
                        >                 
                        <div className="text-foreground py-4 p-2 flex items-center border-b hover:text-primary hover:font-bold">
                            <div className="pr-4 min-w-[70px] max-w-[80px] h-auto">
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
                                        value.categoryDetails.toLowerCase().includes("black magic") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("black") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("premier") ? "premier_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("excellent") ? "excellent_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("deluxe") ? "deluxe_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("classic") ? "acr_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("fabulous") ? "fabulous_white_bg.webp"
                                        : value.categoryDetails.toLowerCase().includes("pro") ? "acr_white_bg.webp"
                                        : value.label.toLowerCase().includes("desibel") ? "desibel_white_bg.webp"
                                        : value.label.toLowerCase().includes("curve") ? "curve_white_bg.webp"
                                        : "acr_white_bg.webp"
                                    }`}
                                    alt="Logo"
                                    width={250}
                                    height={250}
                                    // classname="max-w-[120px] min-w-[100px] h-fit object-contain"
                                    classname="max-h-[17px] min-h-[8px] w-auto object-contain self-start"
                                    lazy={false}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-start text-sm font-bold pt-2 pb-1">
                                    {value.label}
                                </div>
                                <div className="text-xs font-light text-start line-clamp-1">
                                    {value.categoryDetails}
                                </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    ))
                    :
                    <div>                          
                    <div className="p-4 flex justify-center items-center">
                        <div className="text-sm text-foreground">
                        {t('search-not-found')}
                        </div>
                    </div>
                    </div>
                }
                </div>
            </div>
            </div>

        </div>






                {!loadingSlider && Array.isArray(sliderValue) &&
                <div className="shadow-2xl">
                    <div className="w-full flex justify-center">
                        <Button onClick={() => {setReseted('true'), setCurrentPage(1)}} variant={"outline"} className="bg-transparent border-foreground border-4 w-full text-primary hover:border-primary hover:text-primary ">
                            <b>{t('all-filters-clear-filters')}</b>
                        </Button>
                    </div>
                    <div className="p-4 overflow-auto max-h-[calc(100vh-13rem)] scrollbar-thin scrollbar-track-secondary-foreground">
                        {checkbox.map((valueCheckbox, index) =>
                        valueCheckbox.value.length === 1 ? null : (
                            <div key={index} className="grid gap-2 w-full pt-2">
                            <div className="text-center font-bold text-sm text-black">{valueCheckbox.name}</div>
                            {valueCheckbox.value.map((choicesVal, indexChoices) => (
                                <div key={indexChoices} className="flex items-center py-1">
                                <div className="pr-2 flex items-center">
                                    <Checkbox
                                    id={choicesVal}
                                    checked={allActiveCheckbox.some((item) => item.name === choicesVal)}
                                    onClick={() => {handleCheckboxChange(valueCheckbox.slug, choicesVal, valueCheckbox.unit, valueCheckbox.name), setCurrentPage(1)}}
                                    />
                                </div>
                                <label htmlFor={choicesVal} className="text-center text-sm text-black">
                                    {choicesVal} {valueCheckbox.unit}
                                </label>
                                </div>
                            ))  }
                            <hr />
                            </div>
                        )
                        )}
                        
                        {sliderValue.map((sliderValue1, index)=> 
                            sliderValue1.value.length > 1 &&
                            <div key={index} className="grid gap-2 w-full pt-2">
                                <div className="text-center font-bold text-sm text-black">
                                    {sliderValue1.name}
                                </div>
                                {/* <Slider
                                    // key={`slider-${value.slug}-${sheetOpenedForSlider}-${JSON.stringify(getCurrentSliderValue(value))}`}
                                    max={value.max_index}
                                    min={value.min_index}
                                    step={1}
                                    unit={value.unit}
                                    value={value.value}
                                    opensheetvalmin={
                                        (defaultSliderSheet && defaultSliderSheet.find(tempVal => tempVal.slug === value.slug)?.value.min) ?? 0
                                    }
                                    opensheetvalmax={
                                        (defaultSliderSheet && defaultSliderSheet.find(tempVal => tempVal.slug === value.slug)?.value.max) ?? 0
                                    }
                                    resetclicked={reseted}
                                    onValueChange={(val) => {handleSliderChange(value.slug, val, value.min_index, value.max_index, value.value, value.name, value.unit), setCurrentPage(1)}}
                                    className={cn("w-full py-2")}
                                /> */}
                                <Slider
                                    value={[sliderValue1.minIndex, sliderValue1.maxIndex]}
                                    max={sliderValue1.max_index}
                                    min={sliderValue1.min_index}
                                    step={1}
                                    onValueChange={(val) => {
                                    handleSliderChange(sliderValue1.slug, val, sliderValue1.min_index, sliderValue1.max_index, sliderValue1.value, sliderValue1.name, sliderValue1.unit, index)
                                    setCurrentPage(1)
                                    }}
                                    unit={sliderValue1.unit}
                                    dataArray={sliderValue1.value}
                                    className={cn("w-full py-2")}
                                />
                                <hr/>
                            </div>
                        )}
                    </div>
                </div>
                }
            </div>
            </div>
            </>
            :
                // <div className="hidden md:block pr-16"></div>
                <></>
            }
            {loading? 
            <div className="flex w-screen h-screen items-center text-center justify-center">
                <Loader className="animate-spin"/>
            </div>
            :
                allFeaturedProducts.length === 0 ?        
                    <div className="w-full">
                        <div className="flex items-center justify-center h-full w-full text-neutral-500">
                            {t('product-not-found')}
                        </div>
                    </div>
                :
                    <div className={`block w-full ${showFilters && 'xl:pl-20 lg:pl-12 pl-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
                        {paginatedItems.map((item: AllFilterProductsOnlyType, i) => (
                            <div key={i}>
                                <ProductCard key={item.products.id} data={item.products} isSparepart={segmentedPathname[2] === 'spareparts' || segmentedPathname[2] === 'sparepart'} />
                               
                            </div>
                        ))}
                    </div>
                    <div className="md:pt-8 pt-4">
                    <Pagination>
                    <PaginationContent className="flex-wrap gap-1">
                        <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }}
                        />
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {typeof page === "number" ? (
                            <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page)
                                }}
                                className="h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm"
                            >
                                {page}
                            </PaginationLink>
                            ) : (
                            <PaginationEllipsis className="h-8 w-8 sm:h-10 sm:w-10" />
                            )}
                        </PaginationItem>
                        ))}

                        <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }}
                        />
                        </PaginationItem>
                    </PaginationContent>
                    </Pagination>
                </div>
            </div>
            }
           
            </div>
        </>
    );
};

export default AllDriversandFiltersProducts;
