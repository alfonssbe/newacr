"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { activeSlider, NewsType, SliderData, SliderDataNews } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/app/[lang]/components/ui/sheet";
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import { SliderNews } from "@/app/[lang]/components/ui/slidernews";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import NewsCard from "@/app/[lang]/components/ui/news-card";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useMediaQuery } from "@/components/hooks/use-media-query";

type SliderSheetValue = {
    slug: string;
    value: {
      min: number;
      max: number;
    };
};

interface MainProps {
  data: (NewsType)[];
  slider: (SliderDataNews)[]
  showFilters: (boolean)
};

const AllNewsandFilters: React.FC<MainProps> = ({
  data, slider, showFilters
}) => {
    const t = useTranslations('News Page');
    const [allActiveSlider, setAllActiveSlider] = useState<activeSlider[]>([])  
    const [defaultSliderSheet, setdefaultSliderSheet] = useState<SliderSheetValue[]>([])  
    const [sheetOpenedForSlider, setSheetOpenedForSlider] = useState<boolean>(false)  
    const [reseted, setReseted] = useState<string>('false')
    const [loading, setLoading] = useState<boolean>(true)
    const [allNews, setAllNews] = useState<NewsType[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // or whatever number of items per page you want

    const [sliderValue, setSliderValue] = useState<SliderDataNews[]>([])
    const [loadingSlider, setLoadingSlider] = useState<boolean>(true)

    useEffect(() => {
        const fetchDataSlider = async () => {
            try {
                let tempSlider: SliderDataNews[] = []
                slider.map((value) => {
                    tempSlider.push({
                        slug: value.slug,
                        name: value.name,
                        minIndex: value.minIndex,
                        maxIndex: value.maxIndex,
                        min_index: value.min_index,
                        max_index: value.max_index,
                        unit: value.unit,
                        value: value.value,
                        realDate: value.realDate
                    })
                });
                // console.log("tempSlider: ", tempSlider)
                setSliderValue(tempSlider)
                setLoadingSlider(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataSlider();
    }, []);

    const isMobile = useMediaQuery("(max-width: 640px)")

    const totalPages = Math.ceil(allNews.length / itemsPerPage);

    const paginatedItems = allNews.slice(
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

    const handleSliderChange = (slug: string, value: number[], min_index: number, max_index: number, allVal: number[], parentName: string, unit: string, index: number) => {

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

      const normalizeDate = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

      useEffect(() => {
        const fetchData = async () => {
          try {
            let finishedSliderNews: NewsType[] = []
            let tempShowed: NewsType[][] = [];
            

            if (allActiveSlider.length !== 0) {
                allActiveSlider.forEach((slider, indexslider) => {
                    if (!tempShowed[indexslider]) {
                        tempShowed[indexslider] = [];
                    }
                    if (indexslider === 0) {
                        data.forEach((product) => {
                            const productValue = normalizeDate(new Date(product.event_date));
                            const bottomValue = normalizeDate(new Date(slider.bottomRealVal));
                            const topValue = normalizeDate(new Date(slider.topRealVal));

                            if (bottomValue <= productValue && topValue >= productValue) {
                                tempShowed[indexslider].push(product);
                            }
                        });
                    } else {
                        tempShowed[indexslider - 1].forEach((product) => {
                            const productValue = normalizeDate(new Date(product.event_date));
                            const bottomValue = normalizeDate(new Date(slider.bottomRealVal));
                            const topValue = normalizeDate(new Date(slider.topRealVal));


                            if (bottomValue <= productValue && topValue >= productValue) {
                                tempShowed[indexslider].push(product);
                            }
                        });
                    }
                });
                finishedSliderNews = tempShowed[allActiveSlider.length - 1]
            } else {
                finishedSliderNews = data
            }

            let FinalFeatured: NewsType[] = []
            for (const slidernews of finishedSliderNews) {
                FinalFeatured.push(slidernews)
            }

            setAllNews(FinalFeatured)

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [data, allActiveSlider]); 

      useEffect(() => {
        const fetchData = () => {
          try {
            let sliderTemp: SliderSheetValue[] = []
            allActiveSlider.map((value, index) => {
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
            setLoading(false)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [sheetOpenedForSlider, allActiveSlider]); 


    return ( 
        <>
        
        <div className='block lg:hidden text-center pb-4'>
                <div className='pb-4'>
                <Sheet>
                    <SheetTrigger asChild className="hover:cursor-pointer">
                    <div className="w-full text-center font-bold text-lg bg-transparent p-2 rounded-lg text-foreground border-foreground border-4 hover:shadow-lg">
                        {t('news-edit-filters-button')}
                    </div>
                    </SheetTrigger>
                    <SheetContent side={'left'} className="w-full max-w-[300px] sm:max-w-[300px] bg-background px-2">
                    <SheetTitle/>
                    <SheetDescription/>
                    <SheetHeader>
                        <div className="text-lg lg:text-xl font-bold text-center pb-4 text-foreground">
                            {t('news-filters-title')} 
                        </div>
                    </SheetHeader>
                    {!loadingSlider && Array.isArray(sliderValue) &&
                        <ScrollArea className="h-full w-full pb-8 px-2">
                        {sliderValue.map((value, index)=> 
                            value.value.length===1?
                            null
                            :
                            <div key={index} className="grid gap-2 w-full pt-2 px-2">
                                <div className="text-center font-bold text-sm text-foreground">
                                    {value.name}
                                </div>
                                 <SliderNews
                                    value={[value.minIndex, value.maxIndex]}
                                    max={value.max_index}
                                    min={value.min_index}
                                    step={1}
                                    onValueChange={(val) => {
                                    handleSliderChange(
                                        value.slug,
                                        val,
                                        value.min_index,
                                        value.max_index,
                                        value.value,
                                        value.name,
                                        value.unit,
                                        index
                                    )
                                    setCurrentPage(1)
                                    }}
                                    unit={value.unit}
                                    realdatesvalues={value.realDate}
                                    className={cn("w-full py-2")}
                                />
                                <hr/>
                            </div>
                        )}
                        <div className="w-full flex justify-center pt-4 px-2">
                            <Button onClick={() => {setReseted('true'), setCurrentPage(1)}} variant={"outline"} className="bg-transparent border-foreground border-4">
                                <b>{t('news-filters-clear-button')}</b>
                            </Button>
                        </div>
                        </ScrollArea>
                    }
                    </SheetContent>
                </Sheet>
                
                </div>
            </div>
            {!loadingSlider && Array.isArray(sliderValue) &&
            <div className="w-full flex">
            {showFilters?
                <div className="hidden lg:block py-4 pr-4 w-1/4">
                    <div className="w-full flex justify-center pb-4">
                        <Button onClick={() => {setReseted('true'), setCurrentPage(1)}} variant={"outline"} className="bg-transparent border-foreground border-4 w-full">
                            <b>{t('news-filters-clear-button')}</b>
                        </Button>
                    </div>
                    {sliderValue.map((value, index)=> 
                        value.value.length===1?
                        null
                        :
                        <div key={index} className="grid gap-2 w-full max-w-80 pt-2">
                            <div className="text-center font-bold text-sm text-black">
                                {value.name}
                            </div>
                           <SliderNews
                                    value={[value.minIndex, value.maxIndex]}
                                    max={value.max_index}
                                    min={value.min_index}
                                    step={1}
                                    onValueChange={(val) => {
                                    handleSliderChange(
                                        value.slug,
                                        val,
                                        value.min_index,
                                        value.max_index,
                                        value.value,
                                        value.name,
                                        value.unit,
                                        index
                                    )
                                    setCurrentPage(1)
                                    }}
                                    unit={value.unit}
                                    realdatesvalues={value.realDate}
                                    className={cn("w-full py-2")}
                                />
                            <hr/>
                        </div>
                    )}
                </div>
            :
                <div className="hidden md:block pr-16"></div>
            }
            <div className="w-full">
                {loading?
                <div className="w-full flex text-center justify-center"><Loader size={20} className="animate-spin bg-background"/></div>
                :
            // <AllNews allActiveSliderVal={allActiveSlider} news={data}/>
                    allNews.length === 0 ?        
                        <div className="w-full">
                            <div className="flex items-center justify-center h-full w-full text-neutral-500">
                                {t('news-not-found')}
                            </div>
                        </div>
                    :
                        <>
                        <div className="block">
                            {paginatedItems.map((item: NewsType, i) => (
                                <div key={i} className="lg:px-4">
                                    <NewsCard data={item}/>
                                    <Separator/>
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
                    </>
                }
            </div>
            </div>
            }
        </>
    );
};

export default AllNewsandFilters;
