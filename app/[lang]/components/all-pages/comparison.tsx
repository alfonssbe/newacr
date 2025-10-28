"use client"

import { Searchbox, SingleProducts } from '@/app/types';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronsUpDown, FileDown, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import FullScreenLoader from '@/app/[lang]/components/loadingNoScroll';
import { LazyImage } from '@/app/[lang]/components/lazyImage';
import Image from 'next/image';
import getProduct from '@/app/actions/get-one-product';
import getProductsForSearchbox from '@/app/actions/get-product-for-searchbox';
import { LazyImageCustom } from '@/app/[lang]/components/lazyImageCustom';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/app/[lang]/components/ui/breadcrumb';

import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from "yet-another-react-lightbox/plugins/captions";
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import "yet-another-react-lightbox/plugins/captions.css";

function createData(
    name: string,
    attribute: string,
    unit: string,
) {
    return { name, attribute, unit };
}

function groupAllSpecifications(products: SingleProducts[], locale: string) {
  const grouped: Record<string, Record<string, Record<string, string>>> = {};

  products.forEach((product) => {
    product.specification.forEach((spec) => {
      const parent = spec.parentname;
      const sub = spec.subparentname || "";

      if (!grouped[parent]) grouped[parent] = {};
      if (!grouped[parent][sub]) grouped[parent][sub] = {};

      spec.child.map((child) => {
        if (!grouped[parent][sub][locale === 'en' ? child.childnameEnglish : child.childnameIndo]) {
          grouped[parent][sub][locale === 'en' ? child.childnameEnglish : child.childnameIndo] = (locale === 'en' ? child.childnameEnglish : child.childnameIndo);
        }
      });
    });
  });

  return grouped;
}

const ComparisonPage = () => {
    const t = useTranslations('Comparison Page');
    const locale = useLocale()
    const searchParams = useSearchParams();
    const [finalFetchedProduct, setFinalFetchedProduct] = useState<(SingleProducts | null)[]>([])
    const [allSpecsUsed, setAllSpecsUsed] = useState<Record<string, Record<string, Record<string, string>>>>({});
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true)
    const [searchboxData, setSearchboxData] = useState<Searchbox[]>([])
    const [activeHover, setActiveHover] = useState<number>()
    
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [imageHeight, setimageHeight]= useState<string>("250px")
    const [imageHeightCropped, setimageHeightCropped]= useState<string>("200px")


    const [activeSearch1, setactiveSearch1] = useState<string>('');
    const inputRef1 = useRef<HTMLInputElement>(null);
    const [foundProducts1, setfoundProducts1] = useState<Searchbox[]>([]);
    const [activeSearch2, setactiveSearch2] = useState<string>('');
    const inputRef2 = useRef<HTMLInputElement>(null);
    const [foundProducts2, setfoundProducts2] = useState<Searchbox[]>([]);
    const [activeSearch3, setactiveSearch3] = useState<string>('');
    const inputRef3 = useRef<HTMLInputElement>(null);
    const [foundProducts3, setfoundProducts3] = useState<Searchbox[]>([]);


    
    const [lightboxOpen0, setLightboxOpen0] = useState(false)
    const [lightboxIndex0, setLightboxIndex0] = useState(0)
    // 0 = frequency
    // 1 = impedance
    const [lightboxOpen1, setLightboxOpen1] = useState(false)
    const [lightboxIndex1, setLightboxIndex1] = useState(0)
    
    const [lightboxOpen2, setLightboxOpen2] = useState(false)
    const [lightboxIndex2, setLightboxIndex2] = useState(0)

    const openLightbox0 = (index: number) => {
        setLightboxIndex0(index)
        setLightboxOpen0(true)
    }

    const openLightbox1 = (index: number) => {
        setLightboxIndex1(index)
        setLightboxOpen1(true)
    }

    const openLightbox2 = (index: number) => {
        setLightboxIndex2(index)
        setLightboxOpen2(true)
    }


    function searchData(val: string, index: number){
        let select : Searchbox[] = []
        
        const updatedVal = val.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, ' inch');
        const trimmedValue = updatedVal.trimStart().toLowerCase();
        searchboxData.map((value)=>{
        value.value.toLowerCase().includes(trimmedValue)?
            select.push(value)
            :
            ''
        })

        index === 1 ? setfoundProducts1(select) : index === 2 ? setfoundProducts2(select) : setfoundProducts3(select)
    }
  
    // Handle mouse down event to start dragging
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!scrollContainerRef.current) return
  
      setIsDragging(true)
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
      setScrollLeft(scrollContainerRef.current.scrollLeft)
      scrollContainerRef.current.style.cursor = "grabbing"
    }
  
    // Handle mouse move event while dragging
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return
  
      const x = e.pageX - scrollContainerRef.current.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed multiplier
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }
  
    // Handle mouse up event to stop dragging
    const handleMouseUp = () => {
      setIsDragging(false)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = "grab"
      }
    }
  
    // Handle mouse leave event to stop dragging
    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false)
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.cursor = "grab"
        }
      }
    }

    useEffect( () => {
        async function fetchData(){
            const product1slug = searchParams.get('product1slug');
            const product2slug = searchParams.get('product2slug');
            const product3slug = searchParams.get('product3slug');
            let tempAllProduct : SingleProducts[] = []
            if(product1slug){
                let temp: SingleProducts = await getProduct(product1slug, locale);
                tempAllProduct.push(temp)
            }
            if(product2slug){
                let temp: SingleProducts = await getProduct(product2slug, locale);
                tempAllProduct.push(temp)
            }
            if(product3slug){
                let temp: SingleProducts = await getProduct(product3slug, locale);
                tempAllProduct.push(temp)
            }
            const data : Searchbox[] = await getProductsForSearchbox();
            setSearchboxData(data)
            setFinalFetchedProduct(tempAllProduct)
            setAllSpecsUsed(groupAllSpecifications(tempAllProduct , locale))
            setLoading(false)
        }
        fetchData()
    }, [searchParams]);


    

    const rows = [
        createData(t('comparison-page-drawing_foto'), 'drawing', ""),
        createData(t('comparison-page-respon-frekuensi-foto'), 'frequency', ""),
        createData(t('comparison-page-impedansi-foto'), 'impedance', ""),
        createData("Manual", 'manual', ""),
    ];

    const setQueryParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set(key, value); // Adds if not present, updates if exists
        router.push(`?${params.toString()}`);
    };


    return (<>
        {loading?
            <FullScreenLoader isVisible={loading} />
        :
        <div className='bg-background -z-10'>
        <h1 className="sr-only">{t('comparison-page-title')} | ACR Speaker</h1>
            <div className="container mx-auto xl:px-24 lg:px-16 px-10 xl:pt-8 pt-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href={locale === 'id' ? '/' : `/${locale}`}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>{t('comparison-page-breadcrumb')}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        <div className="container mx-auto xl:px-24 lg:px-16 px-0 xl:py-8 lg:py-6 py-4">
            
            <div className='w-full text-center'>
                <h2 className='text-3xl font-bold text-black pb-4 md:pt-0 pt-16'>
                    {t('comparison-page-title')}
                </h2>
            </div>
            <div className="flex justify-center items-center w-full">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto cursor-grab border"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                <div className="grid grid-cols-11 min-w-max pt-4">
                    
                    {/* SEARCH */}
                    <>
                        <div className='col-span-2 w-full'></div>
                        <div className="col-span-3 w-full flex items-center justify-center pb-4 px-2">
                            <div className="relative w-full">
                                <Input 
                                type="text" 
                                placeholder={t('comparison-page-searchbox-placeholder')} 
                                className="w-full text-foreground pr-10 active:border-none focus-visible:outline-hidden focus-visible:ring-transparent bg-secondary h-10" 
                                ref={inputRef1} 
                                onChange={(event) => {
                                    setactiveSearch1(event.target.value);
                                    searchData(event.target.value, 1);
                                }}
                                value={activeSearch1}
                                />

                                {activeSearch1 === '' && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                    <Search className="h-4 w-4" />
                                </div>
                                )}

                                <div className={`${activeSearch1.trim() === "" ? 'hidden' : 'absolute z-10 overflow-y-scroll scrollbar-thin scrollbar-corner-secondary-foreground max-h-[300px] w-full border rounded-lg bg-background'}`}>
                                <div className="overflow-y-auto"> 
                                    {foundProducts1.length !== 0 ? (
                                    foundProducts1.map((searchbox) => (
                                        <div
                                        key={searchbox.value}
                                        onClick={() => {
                                            setQueryParam('product1slug', searchbox.slug);
                                            setactiveSearch1('');
                                        }}
                                        className="flex items-center gap-4 group p-2 border bg-background hover:bg-secondary cursor-pointer transform duration-300 ease-in-out"
                                        >
                                        <Image src={searchbox.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${searchbox.url}` : searchbox.url} alt={searchbox.label} width={50} height={50} className="w-10 h-fit" />
                                        <div className="text-sm text-foreground group-hover:text-primary">{searchbox.label}</div>
                                        </div>
                                    ))
                                    ) : (
                                    <div className="p-4 flex justify-center items-center">
                                        <div className="text-sm text-foreground">
                                        {t('comparison-page-no-product-searchbox')}
                                        </div>
                                    </div>
                                    )}
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-3 w-full flex items-center justify-center pb-4 px-2'>


                            <div className='relative w-full'>
                                <Input 
                                    type="text" 
                                    placeholder={t('comparison-page-searchbox-placeholder')} 
                                    className="w-full text-foreground pr-10 active:border-none focus-visible:outline-hidden focus-visible:ring-transparent bg-secondary h-10" 
                                    ref={inputRef2} 
                                    onChange={(event) =>
                                        (
                                        setactiveSearch2(event.target.value),
                                        searchData(event.target.value, 2)
                                        )
                                    }
                                    value={activeSearch2}
                                />

                                {activeSearch2 === '' && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                    <Search className="h-4 w-4" />
                                </div>
                                )}

                                <div className={`${activeSearch2.trim() === "" ? 'hidden' : 'absolute z-10 overflow-y-scroll scrollbar-thin scrollbar-corner-secondary-foreground max-h-[300px] w-full border rounded-lg bg-background'}`}>
                                    <div className={`overflow-y-auto`}> 
                                    {foundProducts2.length!=0?
                                        foundProducts2.map((searchbox) => (
                                            <div
                                            key={searchbox.value}
                                            onClick={() => {
                                                setQueryParam('product2slug', searchbox.slug)
                                                setactiveSearch2("")
                                            }}
                                            className='flex items-center gap-4 group p-2 border bg-background hover:bg-secondary cursor-pointer'
                                            >
                                                <Image src={searchbox.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${searchbox.url}` : searchbox.url} alt={searchbox.label} width={50} height={50} className='w-10 h-fit'/>
                                                <div className='text-sm text-foreground group-hover:text-primary'>{searchbox.label}
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div>                          
                                        <div className="p-4 flex justify-center items-center">
                                            <div className="text-sm text-foreground">
                                            {t('comparison-page-no-product-searchbox')}
                                            </div>
                                        </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className='col-span-3 w-full flex items-center justify-center pb-4 px-2'>
             
                            <div className='relative w-full'>
                                <Input 
                                    type="text" 
                                    placeholder={t('comparison-page-searchbox-placeholder')} 
                                    className="w-full text-foreground pr-10 active:border-none focus-visible:outline-hidden focus-visible:ring-transparent bg-secondary h-10" 
                                    ref={inputRef3} 
                                    onChange={(event) =>
                                        (
                                        setactiveSearch3(event.target.value),
                                        searchData(event.target.value, 3)
                                        )
                                    }
                                    value={activeSearch3}
                                />
                                
                                {activeSearch3 === '' && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                    <Search className="h-4 w-4" />
                                </div>
                                )}

                                <div className={`${activeSearch3.trim() === "" ? 'hidden' : 'absolute z-10 overflow-y-scroll scrollbar-thin scrollbar-corner-secondary-foreground max-h-[300px] w-full border rounded-lg bg-background'}`}>
                                    <div className={`overflow-y-auto`}> 
                                    {foundProducts3.length!=0?
                                        foundProducts3.map((searchbox) => (
                                            <div
                                            key={searchbox.value}
                                            onClick={() => {
                                                setQueryParam('product3slug', searchbox.slug)
                                                setactiveSearch3("")
                                            }}
                                            className='flex items-center gap-4 group p-2 border bg-background hover:bg-secondary cursor-pointer'
                                            >
                                                <Image src={searchbox.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${searchbox.url}` : searchbox.url} alt={searchbox.label} width={50} height={50} className='w-10 h-fit'/>
                                                <div className='text-sm text-foreground group-hover:text-primary'>{searchbox.label}
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div>                          
                                        <div className="p-4 flex justify-center items-center">
                                            <div className="text-sm text-foreground">
                                            {t('comparison-page-no-product-searchbox')}
                                            </div>
                                        </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </div>


                        </div>
                    </>

                    {/* PRODUCT NAME */}
                    <>
                        <div className='col-span-2 w-full'></div>
                        {finalFetchedProduct[0] && finalFetchedProduct[0].name !== '' ?
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[0]?.slug}` : `/${locale}/products/${finalFetchedProduct[0]?.slug}`} className="col-span-3 w-full flex items-center justify-center font-bold text-2xl text-center px-4"> 
                                {finalFetchedProduct[0].name }
                            </Link>
                        :
                        <div className='col-span-3'></div>}
                        
                        {finalFetchedProduct[1] && finalFetchedProduct[1].name !== '' ?
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[1]?.slug}` : `/${locale}/products/${finalFetchedProduct[1]?.slug}`} className='col-span-3 w-full flex items-center justify-center font-bold text-2xl text-center px-4'> 
                                {finalFetchedProduct[1].name}
                            </Link>
                        :
                        <div className='col-span-3'></div>}
                        
                        {finalFetchedProduct[2] && finalFetchedProduct[2].name !== '' ?
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[2]?.slug}` : `/${locale}/products/${finalFetchedProduct[2]?.slug}`} className='col-span-3 w-full flex items-center justify-center font-bold text-2xl text-center px-4'> 
                                {finalFetchedProduct[2].name}
                            </Link>
                        :
                        <div className='col-span-3'></div>}
                    </>

                    {/* SHORT DESC PRODUCT */}
                    <>
                        <div className='col-span-2 w-full'></div>
                        {finalFetchedProduct[0] && finalFetchedProduct[0].slug != '' ?
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[0]?.slug}` : `/${locale}/products/${finalFetchedProduct[0]?.slug}`} className='col-span-3 w-full flex items-center justify-center font-light text-center px-4'>
                                {finalFetchedProduct[0].size && finalFetchedProduct[0].size.label != '-' && finalFetchedProduct[0].size.value.toString().concat(" inch ")}{finalFetchedProduct[0] && finalFetchedProduct[0].sub_sub_categories.length > 0 && finalFetchedProduct[0].sub_sub_categories[0].name}{finalFetchedProduct[0] && finalFetchedProduct[0].series.length>0 && " - ".concat(finalFetchedProduct[0].series[0].name, " Series")}
                            </Link>
                        :
                            <div className='col-span-3'></div>
                        }

                        {finalFetchedProduct[1] && finalFetchedProduct[1].slug != '' ?
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[1]?.slug}` : `/${locale}/products/${finalFetchedProduct[1]?.slug}`} className='col-span-3 w-full flex items-center justify-center font-light text-center px-4'>
                                {finalFetchedProduct[1].size && finalFetchedProduct[1].size.label != '-' && finalFetchedProduct[1].size.value.toString().concat(" inch ")}{finalFetchedProduct[1] && finalFetchedProduct[1].sub_sub_categories.length > 0 && finalFetchedProduct[1].sub_sub_categories[0].name}{finalFetchedProduct[1] && finalFetchedProduct[1].series.length>0 && " - ".concat(finalFetchedProduct[1].series[0].name, " Series")}
                            </Link>
                        :
                            <div className='col-span-3'></div>
                        }
                        
                        {finalFetchedProduct[2] && finalFetchedProduct[2].slug != '' ?
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[2]?.slug}` : `/${locale}/products/${finalFetchedProduct[2]?.slug}`} className='col-span-3 w-full flex items-center justify-center font-light text-center px-4'>
                                {finalFetchedProduct[2].size && finalFetchedProduct[2].size.label != '-' && finalFetchedProduct[2].size.value.toString().concat(" inch ")}{finalFetchedProduct[2] && finalFetchedProduct[2].sub_sub_categories.length > 0 && finalFetchedProduct[2].sub_sub_categories[0].name}{finalFetchedProduct[2] && finalFetchedProduct[2].series.length>0 && " - ".concat(finalFetchedProduct[2].series[0].name, " Series")}
                            </Link>
                        :
                            <div className='col-span-3'></div>
                        }
                    </>

                    {/* PRODUCT IMAGE */}
                    <>
                        <div className='col-span-2 w-full font-bold'></div>
                        
                       <div className="col-span-3 w-full flex items-center justify-center px-4">
                        {finalFetchedProduct[0] && finalFetchedProduct[0].coverImg.url !== "" && finalFetchedProduct[0].slug !== "" && (
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[0]?.slug}` : `/${locale}/products/${finalFetchedProduct[0]?.slug}`} className={`relative w-full h-[${imageHeight}] overflow-hidden`}>
                            <LazyImageCustom
                                src={finalFetchedProduct[0].coverImg.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[0].coverImg.url}` : finalFetchedProduct[0].coverImg.url}
                                alt={`${finalFetchedProduct[0].name} - Main Photo`}
                                width={300}
                                height={300}
                                classname={`w-full h-[${imageHeightCropped}] object-cover object-top`}
                                lazy={true}
                            />
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-b from-transparent to-background pointer-events-none" />
                            </Link>
                        )}
                        </div>
                        
                       <div className="col-span-3 w-full flex items-center justify-center px-4">
                        {finalFetchedProduct[1] && finalFetchedProduct[1].coverImg.url !== "" && finalFetchedProduct[1].slug !== "" && (
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[1]?.slug}` : `/${locale}/products/${finalFetchedProduct[1]?.slug}`} className={`relative w-full h-[${imageHeight}] overflow-hidden`}>
                            <LazyImageCustom
                                src={finalFetchedProduct[1].coverImg.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[1].coverImg.url}` : finalFetchedProduct[1].coverImg.url}
                                alt={`${finalFetchedProduct[1].name} - Main Photo`}
                                width={300}
                                height={300}
                                classname={`w-full h-[${imageHeightCropped}] object-cover object-top`}
                                lazy={true}
                            />
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-b from-transparent to-background pointer-events-none" />
                            </Link>
                        )}
                        </div>
                        
                       <div className="col-span-3 w-full flex items-center justify-center px-4">
                        {finalFetchedProduct[2] && finalFetchedProduct[2].coverImg.url !== "" && finalFetchedProduct[2].slug !== "" && (
                            <Link href={locale === 'id' ? `/produk/${finalFetchedProduct[2]?.slug}` : `/${locale}/products/${finalFetchedProduct[2]?.slug}`} className={`relative w-full h-[${imageHeight}] overflow-hidden`}>
                            <LazyImageCustom
                                src={finalFetchedProduct[2].coverImg.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[2].coverImg.url}` : finalFetchedProduct[2].coverImg.url}
                                alt={`${finalFetchedProduct[2].name} - Main Photo`}
                                width={300}
                                height={300}
                                classname={`w-full h-[${imageHeightCropped}] object-cover object-top`}
                                lazy={true}
                            />
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-b from-transparent to-background pointer-events-none" />
                            </Link>
                        )}
                        </div>
                    </>
                    



                    {Object.entries(allSpecsUsed).map(([parentKey, subRecord], indexParent) =>
                        parentKey !== "Additional Notes" && parentKey !== "Tambahan Catatan" &&
                        Object.entries(subRecord).map(([subKey, childRecord]) =>
                            Object.entries(childRecord).map(([childKey, _], indexHover) => {
                            // Compute a unique, sequential index starting from rows.length
                            const rowIndex =
                                rows.length +
                                indexHover +
                                indexParent * 1000 + // space between parent groups
                                Object.keys(subRecord).indexOf(subKey) * 100; // avoid overlap between subcategories

                            return (
                                <Fragment key={`${parentKey}-${subKey}-${childKey}-${rowIndex}`}>
                                <div
                                    className="contents"
                                    onMouseEnter={() => setActiveHover(rowIndex)}
                                    onMouseLeave={() => setActiveHover(undefined)}
                                >
                                    {/* Spec name cell */}
                                    <div
                                    className={`${
                                        activeHover === rowIndex
                                        ? "bg-primary text-background"
                                        : "bg-secondary"
                                    } col-span-2 w-full border p-1 border-foreground flex text-center items-center justify-center transition-colors duration-200 ease-in-out`}
                                    >
                                    {parentKey !== "Additional Notes" && childKey}
                                    </div>

                                    {/* Product 0 */}
                                    <div
                                    className={`${
                                        activeHover === rowIndex
                                        ? "bg-primary text-background"
                                        : "bg-transparent"
                                    } col-span-3 w-full border border-foreground flex text-center items-center justify-center transition-colors duration-200 ease-in-out`}
                                    >
                                    {(() => {
                                        const foundChild = finalFetchedProduct[0]?.specification.find(
                                        (spec) =>
                                            spec.parentname === parentKey &&
                                            spec.subparentname === subKey &&
                                            spec.child.some(
                                            (subval) => (locale === 'en' ? subval.childnameEnglish : subval.childnameIndo) === childKey
                                            )
                                        );

                                        const matchedChild = foundChild?.child.find(
                                        (subval) => (locale === 'en' ? subval.childnameEnglish : subval.childnameIndo) === childKey
                                        );
                                        
                                        const value = matchedChild?.value ?? "-";
                                        const unit = matchedChild?.unit ?? "";

                                        return value !== "-" ? `${value} ${unit}` : value;
                                    })()}
                                    </div>

                                    {/* Product 1 */}
                                    <div
                                    className={`${
                                        activeHover === rowIndex
                                        ? "bg-primary text-background"
                                        : "bg-transparent"
                                    } col-span-3 w-full border border-foreground flex text-center items-center justify-center transition-colors duration-200 ease-in-out`}
                                    >
                                    {(() => {
                                        const foundChild = finalFetchedProduct[1]?.specification.find(
                                        (spec) =>
                                            spec.parentname === parentKey &&
                                            spec.subparentname === subKey &&
                                            spec.child.some(
                                            (subval) => (locale === 'en' ? subval.childnameEnglish : subval.childnameIndo) === childKey
                                            )
                                        );

                                        const matchedChild = foundChild?.child.find(
                                        (subval) => (locale === 'en' ? subval.childnameEnglish : subval.childnameIndo) === childKey
                                        );

                                        const value = matchedChild?.value ?? "-";
                                        const unit = matchedChild?.unit ?? "";

                                        return value !== "-" ? `${value} ${unit}` : value;
                                    })()}
                                    </div>

                                    {/* Product 2 */}
                                    <div
                                    className={`${
                                        activeHover === rowIndex
                                        ? "bg-primary text-background"
                                        : "bg-transparent"
                                    } col-span-3 w-full border border-foreground flex text-center items-center justify-center transition-colors duration-200 ease-in-out`}
                                    >
                                    {(() => {
                                        const foundChild = finalFetchedProduct[2]?.specification.find(
                                        (spec) =>
                                            spec.parentname === parentKey &&
                                            spec.subparentname === subKey &&
                                            spec.child.some(
                                            (subval) => (locale === 'en' ? subval.childnameEnglish : subval.childnameIndo) === childKey
                                            )
                                        );

                                        const matchedChild = foundChild?.child.find(
                                        (subval) => (locale === 'en' ? subval.childnameEnglish : subval.childnameIndo) === childKey
                                        );

                                        const value = matchedChild?.value ?? "-";
                                        const unit = matchedChild?.unit ?? "";

                                        return value !== "-" ? `${value} ${unit}` : value;
                                    })()}
                                    </div>
                                </div>
                                </Fragment>
                            );
                            })
                        )
                    )}


                    {rows.map((row,indexHover) => 
                        row.attribute === 'frequency' ?
                            <div className="contents" onMouseEnter={() => setActiveHover(indexHover)} onMouseLeave={() => setActiveHover(undefined)} key={indexHover}>
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-secondary"}
                                        col-span-2 w-full border border-foreground flex text-center items-center justify-center p-1
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {row.name}
                                </div>
                                
                                <div    
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[0] && finalFetchedProduct[0].graph.length > 0 ?
                                    <div className='h-full w-full' onClick={() => openLightbox0(0)}>
                                            <LazyImage
                                                src={finalFetchedProduct[0].graph[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[0].graph[0].url}` : finalFetchedProduct[0].graph[0].url}
                                                alt={`${finalFetchedProduct[0].name} - Frequency Response`}
                                                width={300}
                                                height={300} 
                                            />
                                        </div>
                                        :
                                        <>-</>
                                    }
                                </div>
                                
                                <div 
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[1] && finalFetchedProduct[1].graph.length > 0 ?
                                    <div className='h-full w-full' onClick={() => openLightbox1(0)}>
                                        <LazyImage
                                            src={finalFetchedProduct[1].graph[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[1].graph[0].url}` : finalFetchedProduct[1].graph[0].url}
                                            alt={`${finalFetchedProduct[1].name} - Frequency Response`}
                                            width={300}
                                            height={300} 
                                        />
                                    </div>
                                    :
                                    <>-</>
                                    }
                                </div>
                                
                                <div 
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                            >
                                    {finalFetchedProduct[2] && finalFetchedProduct[2].graph.length > 0 ?
                                    <div className='h-full w-full' onClick={() => openLightbox2(0)}>
                                        <LazyImage
                                            src={finalFetchedProduct[2].graph[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[2].graph[0].url}` : finalFetchedProduct[2].graph[0].url}
                                            alt={`${finalFetchedProduct[2].name} - Frequency Response`}
                                            width={300}
                                            height={300} 
                                        />
                                    </div>
                                    :
                                    <>-</>
                                    }
                                </div>
                            </div>
                        : row.attribute === 'impedance' ?
                            <div className="contents" onMouseEnter={() => setActiveHover(indexHover)} onMouseLeave={() => setActiveHover(undefined)} key={indexHover}>
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-secondary"}
                                        col-span-2 w-full border border-foreground flex text-center items-center justify-center p-1
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >{row.name}</div>
                                
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[0] && finalFetchedProduct[0].impedance.length > 0 ?
                                    <div className='h-full w-full' onClick={() => openLightbox0(1)}>
                                        <LazyImage
                                            src={finalFetchedProduct[0].impedance[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[0].impedance[0].url}` : finalFetchedProduct[0].impedance[0].url}
                                            alt={`${finalFetchedProduct[0].name} - Impedance`}
                                            width={300}
                                            height={300} 
                                        />
                                    </div>
                                    :
                                    <>-</>
                                    }
                                </div>
                                
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[1] && finalFetchedProduct[1].impedance.length > 0 ?
                                    <div className='h-full w-full' onClick={() => openLightbox1(1)}>
                                        <LazyImage
                                            src={finalFetchedProduct[1].impedance[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[1].impedance[0].url}` : finalFetchedProduct[1].impedance[0].url}
                                            alt={`${finalFetchedProduct[1].name} - Impedance`}
                                            width={300}
                                            height={300} 
                                        />
                                    </div>
                                    :
                                    <>-</>
                                    }
                                </div>
                                
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[2] && finalFetchedProduct[2].impedance.length > 0 ?
                                    <div className='h-full w-full'onClick={() => openLightbox2(1)}>
                                            <LazyImage
                                                src={finalFetchedProduct[2].impedance[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[2].impedance[0].url}` : finalFetchedProduct[2].impedance[0].url}
                                                alt={`${finalFetchedProduct[2].name} - Impedance`}
                                                width={300}
                                                height={300} 
                                            />
                                        </div>
                                        :
                                        <>-</>
                                    }
                                </div>
                            </div>
                        : row.attribute === 'drawing' ?
                            <div className="contents" onMouseEnter={() => setActiveHover(indexHover)} onMouseLeave={() => setActiveHover(undefined)} key={indexHover}>
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-secondary"}
                                        col-span-2 w-full border border-foreground flex text-center items-center justify-center p-1
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >{row.name}</div>
                                
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[0] && finalFetchedProduct[0].drawing.length > 0 ? 
                                        <div className='h-full w-full' onClick={() => openLightbox0(1)}>
                                            <LazyImage
                                                src={finalFetchedProduct[0].drawing[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[0].drawing[0].url}` : finalFetchedProduct[0].drawing[0].url}
                                                alt={`${finalFetchedProduct[0].name} - Drawing`}
                                                width={300}
                                                height={300} 
                                            />
                                        </div>
                                    :
                                        <>-</>
                                }
                                </div>
                                
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[1] && finalFetchedProduct[1].drawing.length > 0 ?
                                    <div className='h-full w-full' onClick={() => openLightbox1(1)}>
                                            <LazyImage
                                                src={finalFetchedProduct[1].drawing[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[1].drawing[0].url}` : finalFetchedProduct[1].drawing[0].url}
                                                alt={`${finalFetchedProduct[1].name} - Drawing`}
                                                width={300}
                                                height={300} 
                                            />
                                        </div>
                                    :
                                        <>-</>
                                    }
                                </div>
                                
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[2] && finalFetchedProduct[2].drawing.length > 0 ?
                                    <div className='h-full w-full'onClick={() => openLightbox2(1)}>
                                        <LazyImage
                                            src={finalFetchedProduct[2].drawing[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[2].drawing[0].url}` : finalFetchedProduct[2].drawing[0].url}
                                            alt={`${finalFetchedProduct[2].name} - Drawing`}
                                            width={300}
                                            height={300} 
                                        />
                                    </div>
                                    :
                                    <>-</>
                                    }
                                </div>
                            </div>
                        : row.attribute === 'manual' ?
                            <div className="contents" onMouseEnter={() => setActiveHover(indexHover)} onMouseLeave={() => setActiveHover(undefined)} key={indexHover}>
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-secondary"}
                                        col-span-2 w-full border border-foreground flex text-center items-center justify-center p-1
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    Manual
                                </div>
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[0] && finalFetchedProduct[0].datasheet.length > 0 
                                    ?
                                        <Link href={finalFetchedProduct[0].datasheet[0].url} target="_blank">
                                            <div className="w-full bg-primary border-2 border-foreground text-background flex justify-center items-center p-2 rounded-lg hover:bg-foreground transition-all ease-in-out duration-200 gap-2">
                                                <div>{t("comparison-page-datasheet")}</div>
                                                <FileDown size={20} />
                                            </div>
                                        </Link>
                                    :
                                    <>-</>
                                    }
                                </div>
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[1] && finalFetchedProduct[1].datasheet.length > 0 ?
                                        <Link href={finalFetchedProduct[1].datasheet[0].url} target="_blank">
                                            <div className="w-full bg-primary border-2 border-foreground text-background flex justify-center items-center p-2 rounded-lg hover:bg-foreground transition-all ease-in-out duration-200 gap-2">
                                                <div>{t("comparison-page-datasheet")}</div>
                                                <FileDown size={20} />
                                            </div>
                                        </Link>
                                    :
                                    <>-</>
                                    }
                                </div>
                                <div
                                    className={`
                                        ${activeHover === indexHover ? "bg-primary text-background" : "bg-transparent"}
                                        col-span-3 w-full border border-foreground flex text-center items-center justify-center p-2
                                        transition-colors duration-200 ease-in-out
                                    `}
                                >
                                    {finalFetchedProduct[2] && finalFetchedProduct[2].datasheet.length > 0 ?
                                        <Link href={finalFetchedProduct[2].datasheet[0].url} target="_blank">
                                            <div className="w-full bg-primary border-2 border-foreground text-background flex justify-center items-center p-2 rounded-lg hover:bg-foreground transition-all ease-in-out duration-200 gap-2">
                                                <div>{t("comparison-page-datasheet")}</div>
                                                <FileDown size={20} />
                                            </div>
                                        </Link>
                                        :
                                        <>-</>
                                    }
                                </div>
                            </div>
                        :
                        <></>
                        )}




                    



                </div>
                        
                </div>
            </div>

        </div>
        
              
        </div>
        }
        {finalFetchedProduct[0] && 
            <Lightbox
                open={lightboxOpen0}
                close={() => setLightboxOpen0(false)}
                index={0}
                slides={[{ src: lightboxIndex0 === 0 ? finalFetchedProduct[0].graph[0].url?.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[0].graph[0].url}` : finalFetchedProduct[0].graph[0].url : finalFetchedProduct[0].impedance[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[0].impedance[0].url}` : finalFetchedProduct[0].impedance[0].url , title: lightboxIndex0 === 0 ? `${finalFetchedProduct[0].name} - ${t('comparison-page-respon-frekuensi-foto')}` : `${finalFetchedProduct[0].name} - ${t('comparison-page-impedansi-foto')}`, alt: lightboxIndex0 === 0 ? `${finalFetchedProduct[0].name} - ${t('comparison-page-respon-frekuensi-foto')}` : `${finalFetchedProduct[0].name} - ${t('comparison-page-impedansi-foto')}` }]}
                plugins={[Zoom, Captions]}
                carousel={{ finite: true }}      // prevents looping
            />
        }
        
        {finalFetchedProduct[1] && 
            <Lightbox
                open={lightboxOpen1}
                close={() => setLightboxOpen1(false)}
                index={0}
                slides={[{ src: lightboxIndex1 === 0 ? finalFetchedProduct[1].graph[0].url?.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[1].graph[0].url}` : finalFetchedProduct[1].graph[0].url : finalFetchedProduct[1].impedance[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[1].impedance[0].url}` : finalFetchedProduct[1].impedance[0].url , title: lightboxIndex1 === 0 ? `${finalFetchedProduct[1].name} - ${t('comparison-page-respon-frekuensi-foto')}` : `${finalFetchedProduct[1].name} - ${t('comparison-page-impedansi-foto')}`, alt: lightboxIndex1 === 0 ? `${finalFetchedProduct[1].name} - ${t('comparison-page-respon-frekuensi-foto')}` : `${finalFetchedProduct[1].name} - ${t('comparison-page-impedansi-foto')}` }]}
                plugins={[Zoom, Captions]}
                carousel={{ finite: true }}      // prevents looping
            />
        }
        
        {finalFetchedProduct[2] && 
            <Lightbox
                open={lightboxOpen2}
                close={() => setLightboxOpen2(false)}
                index={0}
                slides={[{ src: lightboxIndex2 === 0 ? finalFetchedProduct[2].graph[0].url?.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[2].graph[0].url}` : finalFetchedProduct[2].graph[0].url : finalFetchedProduct[2].impedance[0].url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finalFetchedProduct[2].impedance[0].url}` : finalFetchedProduct[2].impedance[0].url , title: lightboxIndex2 === 0 ? `${finalFetchedProduct[2].name} - ${t('comparison-page-respon-frekuensi-foto')}` : `${finalFetchedProduct[2].name} - ${t('comparison-page-impedansi-foto')}`, alt: lightboxIndex2 === 0 ? `${finalFetchedProduct[2].name} - ${t('comparison-page-respon-frekuensi-foto')}` : `${finalFetchedProduct[2].name} - ${t('comparison-page-impedansi-foto')}` }]}
                plugins={[Zoom, Captions]}
                carousel={{ finite: true }}      // prevents looping
            />
        }
    </>);
}

export default ComparisonPage;
