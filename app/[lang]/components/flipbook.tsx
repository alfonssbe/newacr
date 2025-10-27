"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, ChevronRight, ChevronLeft } from "lucide-react"
import { Card } from "./ui/card"
import HTMLFlipBook from 'react-pageflip';
import { Loader } from "./ui/loader"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { LazyImageCustom } from "./lazyImageCustom"

// PDF.js types
declare global {
  interface Window {
    pdfjsLib: any
  }
}

type PageData = {
  pageNumber: number
  imageUrl: string
}


export default function PDFViewer() {
  const [pagesAllACR, setpagesAllACR] = useState<PageData[]>([])
  const [pagesACROriginal, setpagesACROriginal] = useState<PageData[]>([])
  const [pagesACRFab, setpagesACRFab] = useState<PageData[]>([])
  const [pagesACRSeries, setpagesACRSeries] = useState<PageData[]>([])
  const [pagesACRBlack, setpagesACRBlack] = useState<PageData[]>([])
  const [pagesAllDesibel, setpagesAllDesibel] = useState<PageData[]>([])
  const [loadingAllACR, setLoadingAllACR] = useState(true)
  const [loadingACROriginal, setLoadingACROriginal] = useState(true)
  const [loadingACRFab, setLoadingACRFab] = useState(true)
  const [loadingACRSeries, setLoadingACRSeries] = useState(true)
  const [loadingACRBlack, setLoadingACRBlack] = useState(true)
  const [loadingAllDesibel, setLoadingAllDesibel] = useState(true)
  const [error, setError] = useState<string | null>(null)


  
const [currentPageAllACR, setCurrentPageAllACR] = useState(0)

const [currentPageACROriginal, setCurrentPageACROriginal] = useState(0)

const [currentPageACRFab, setCurrentPageACRFab] = useState(0)

const [currentPageACRSeries, setCurrentPageACRSeries] = useState(0)

const [currentPageACRBlack, setCurrentPageACRBlack] = useState(0)

const [currentPageAllDesibel, setCurrentPageAllDesibel] = useState(0)

  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isSmallDesktop, setisSmallDesktop] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  
  // Responsive dimensions
  const getResponsiveDimensions = () => {
    if (isMobile) {
      return { width: 314, height: 442 }
    } else if (isTablet) {
      return { width: 364, height: 512 }
    } else if (isSmallDesktop) {
      return { width: 389, height: 547 }
    } else {
      return { width: 414, height: 583 }
    }
  }

  const { width, height } = getResponsiveDimensions()


  const [loadingPage, setLoadingPage] = useState<boolean>(true)

const prevScreenType = useRef({
  isMobile: false,
  isTablet: false,
  isSmallDesktop: false,
  isDesktop: false,
})

useEffect(() => {
  const checkScreenSize = () => {
    const width = window.innerWidth
    const isMobileNow = width < 768
    const isTabletNow = width >= 768 && width < 1024
    const isSmallDesktopNow = width >= 1024 && width < 1200
    const isDesktopNow = width >= 1200

    // Update states
    setIsMobile(isMobileNow)
    setIsTablet(isTabletNow)
    setisSmallDesktop(isSmallDesktopNow)
    setIsDesktop(isDesktopNow)

    const prev = prevScreenType.current

    if (
      prev.isMobile !== isMobileNow ||
      prev.isTablet !== isTabletNow ||
      prev.isSmallDesktop !== isSmallDesktopNow ||
      prev.isDesktop !== isDesktopNow
    ) {
      setCurrentPageACRFab(0)
      setCurrentPageACROriginal(0)
      setCurrentPageACRSeries(0)
      setCurrentPageACRBlack(0)
      setCurrentPageAllACR(0)
      setCurrentPageAllDesibel(0)

      // update ref
      prevScreenType.current = {
        isMobile: isMobileNow,
        isTablet: isTabletNow,
        isSmallDesktop: isSmallDesktopNow,
        isDesktop: isDesktopNow,
      }
    }
  }

  checkScreenSize()
  setLoadingPage(false)
  window.addEventListener("resize", checkScreenSize)
  return () => window.removeEventListener("resize", checkScreenSize)
}, [])

  const maxFailedCounter = 2
  let counterFailedAllACR = 0
  let counterFailedACROriginal = 0
  let counterFailedACRFab = 0
  let counterFailedACRSeries = 0
  let counterFailedACRBlack = 0
  let counterFailedAllDesibel = 0

  const flipBookRefAllACR = useRef<any>(null)
  const flipBookRefACROriginal = useRef<any>(null)
  const flipBookRefACRFab = useRef<any>(null)
  const flipBookRefACRSeries = useRef<any>(null)
  const flipBookRefACRBlack = useRef<any>(null)
  const flipBookRefAllDesibel = useRef<any>(null)

  const goToPrevPage = (ref: React.RefObject<any>) => {
    if (ref.current) {
      ref.current.pageFlip().flipPrev()
    }
  }

  const goToNextPage = (ref: React.RefObject<any>) => {
    if (ref.current) {
      ref.current.pageFlip().flipNext()
    }
  }

  // Load PDF.js
  useEffect(() => {
    async function transformPDF() {
      setLoadingAllACR(true)
      setLoadingACROriginal(true)
      setLoadingACRFab(true)
      setLoadingACRSeries(true)
      setLoadingACRBlack(true)
      setLoadingAllDesibel(true)

      try {
        const [
          allACR,
          ACROriginal,
          ACRFab,
          ACRSeries,
          ACRBlack,
          AllDesibel,
        ] = await Promise.all([
          processPDF("Catalogue_All_Brand_2024", 42),     // put actual page count
          processPDF("Brosur_ACR_Original_24", 16),
          processPDF("Brosur_ACR_Fabulous_25", 40),
          processPDF("Brosur_ACR_Series_24", 28),
          processPDF("Brosur_ACR_Black_25", 12),
          processPDF("Brosur-Desibel-2023", 12),
        ])

        setpagesAllACR(allACR)
        setpagesACROriginal(ACROriginal)
        setpagesACRFab(ACRFab)
        setpagesACRSeries(ACRSeries)
        setpagesACRBlack(ACRBlack)
        setpagesAllDesibel(AllDesibel)
      } catch (err) {
        setError("One or more image sets failed to load.")
        console.error(err)
      } finally {
        setLoadingAllACR(false)
        setLoadingACROriginal(false)
        setLoadingACRFab(false)
        setLoadingACRSeries(false)
        setLoadingACRBlack(false)
        setLoadingAllDesibel(false)
      }
    }

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
      }
    }
    document.head.appendChild(script)
    transformPDF()

    return () => {
      document.head.removeChild(script)
    }
  }, [isMobile, isTablet, isSmallDesktop, isDesktop])

  const processPDF = async (folderBase: string, pageCount: number) => {
  try {
    const imageUrls: PageData[] = []

    for (let page = isTablet || isMobile? 1 : 0; page < (isTablet || isMobile? pageCount + 1 : pageCount); page++) {
      const padded = page.toString().padStart(4, "0")
      const imageUrl = `/catalog/${folderBase}/${folderBase}_page-${padded}.webp`

      imageUrls.push({
        pageNumber: page,
        imageUrl: imageUrl,
      })
    }

    return imageUrls
  } catch (err) {
    setError(`Error processing image set: ${folderBase}`)
    console.error(err)
    return []
  }
}

  async function retryLoading(index: number) {
    if(index === 0) {
      setLoadingAllACR(true)
      const allACR = processPDF("Catalogue_All_Brand_2024", 42)
      setpagesAllACR((await allACR) ?? [])
      setLoadingAllACR(false)
    }
    else if(index === 1){
      setLoadingACROriginal(true)
      const ACROriginal = processPDF("Brosur_ACR_Original_24", 16)
      setpagesACROriginal((await ACROriginal) ?? [])
      setLoadingACROriginal(false)
    }
    else if(index === 2){
      setLoadingACRFab(true)
      const ACRFab = processPDF("Brosur_ACR_Fabulous_25", 40)
      setpagesACRFab((await ACRFab) ?? [])
      setLoadingACRFab(false)
    }
    else if(index === 3){
      setLoadingACRSeries(true)
      const ACRSeries = processPDF("Brosur_ACR_Series_24", 28)
      setpagesACRSeries((await ACRSeries) ?? [])
      setLoadingACRSeries(false)
    }
    else if(index === 5){
      setLoadingACRBlack(true)
      const ACRBlack = processPDF("Brosur_ACR_Black_25", 12)
      setpagesACRBlack((await ACRBlack) ?? [])
      setLoadingACRBlack(false)
    }
    else if(index === 4){
      setLoadingAllDesibel(true)
      const AllDesibel = processPDF("Brosur-Desibel-2023", 12)
      setpagesAllDesibel((await AllDesibel) ?? [])
      setLoadingAllDesibel(false)
    }
  }

  const t_catalog = useTranslations("Catalogue Page")


  const renderFallbackCardAllACR = () => {
    if (maxFailedCounter > counterFailedAllACR) {
      retryLoading(0)
      counterFailedAllACR+=1
      return null // Return null to avoid rendering anything yet
    }
    else{
      counterFailedAllACR = 0
    }
    return (
      <Card
        className="flex items-center justify-center p-8 bg-secondary"
        style={{
          width: isMobile || isTablet ? width : width * 2,
          height,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary text-xl">⚠</span>
          </div>
          <p className="text-sm font-medium text-primary mb-1">{t_catalog('catalogue-error-1')}</p>
          <p className="text-xs text-primary mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={() => retryLoading(0)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t_catalog('catalogue-try-again')}
          </Button>
        </div>
      </Card>
    )
  }


  const renderFallbackCardACROriginal = () => {
    if (maxFailedCounter > counterFailedACROriginal) {
      retryLoading(1)
      counterFailedACROriginal+=1
      return null // Return null to avoid rendering anything yet
    }
    else{
      counterFailedACROriginal = 0
    }
    return (
      <Card
        className="flex items-center justify-center p-8 bg-secondary"
        style={{
          width: isMobile || isTablet ? width : width * 2,
          height,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary text-xl">⚠</span>
          </div>
          <p className="text-sm font-medium text-primary mb-1">{t_catalog('catalogue-error-2')}</p>
          <p className="text-xs text-primary mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={() => retryLoading(1)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t_catalog('catalogue-try-again')}
          </Button>
        </div>
      </Card>
    )
  }


  const renderFallbackCardACRFab = () => {
    if (maxFailedCounter > counterFailedACRFab) {
      retryLoading(2)
      counterFailedACRFab+=1
      return null // Return null to avoid rendering anything yet
    }
    else{
      counterFailedACRFab = 0
    }
    return (
      <Card
        className="flex items-center justify-center p-8 bg-secondary"
        style={{
          width: isMobile || isTablet ? width : width * 2,
          height,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary text-xl">⚠</span>
          </div>
          <p className="text-sm font-medium text-primary mb-1">{t_catalog('catalogue-error-3')}</p>
          <p className="text-xs text-primary mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={() => retryLoading(2)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t_catalog('catalogue-try-again')}
          </Button>
        </div>
      </Card>
    )
  }


  const renderFallbackCardACRSeries = () => {
    if (maxFailedCounter > counterFailedACRSeries) {
      retryLoading(3)
      counterFailedACRSeries+=1
      return null // Return null to avoid rendering anything yet
    }
    else{
      counterFailedACRSeries = 0
    }
    return (
      <Card
        className="flex items-center justify-center p-8 bg-secondary"
        style={{
          width: isMobile || isTablet ? width : width * 2,
          height,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary text-xl">⚠</span>
          </div>
          <p className="text-sm font-medium text-primary mb-1">{t_catalog('catalogue-error-4')}</p>
          <p className="text-xs text-primary mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={() => retryLoading(3)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t_catalog('catalogue-try-again')}
          </Button>
        </div>
      </Card>
    )
  }


  const renderFallbackCardACRBlack = () => {
    if (maxFailedCounter > counterFailedACRBlack) {
      retryLoading(5)
      counterFailedACRBlack+=1
      return null // Return null to avoid rendering anything yet
    }
    else{
      counterFailedACRBlack = 0
    }
    return (
      <Card
        className="flex items-center justify-center p-8 bg-secondary"
        style={{
          width: isMobile || isTablet ? width : width * 2,
          height,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary text-xl">⚠</span>
          </div>
          <p className="text-sm font-medium text-primary mb-1">{t_catalog('catalogue-error-6')}</p>
          <p className="text-xs text-primary mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={() => retryLoading(5)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t_catalog('catalogue-try-again')}
          </Button>
        </div>
      </Card>
    )
  }


  const renderFallbackCardAllDesibel = () => {
    if (maxFailedCounter > counterFailedAllDesibel) {
      retryLoading(4)
      counterFailedAllDesibel+=1
      return null // Return null to avoid rendering anything yet
    }
    else{
      counterFailedAllDesibel = 0
    }
    return (
      <Card
        className="flex items-center justify-center p-8 bg-secondary"
        style={{
          width: isMobile || isTablet ? width : width * 2,
          height,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary text-xl">⚠</span>
          </div>
          <p className="text-sm font-medium text-primary mb-1">{t_catalog('catalogue-error-5')}</p>
          <p className="text-xs text-primary mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={() => retryLoading(4)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t_catalog('catalogue-try-again')}
          </Button>
        </div>
      </Card>
    )
  }

  const totalPagesAllACR = pagesAllACR.length 
  const totalPagesACRFab = pagesACRFab.length 
  const totalPagesACROriginal = pagesACROriginal.length 
  const totalPagesACRSeries = pagesACRSeries.length 
  const totalPagesACRBlack = pagesACRBlack.length 
  const totalPagesAllDesibel = pagesAllDesibel.length 
  

  return (      
    <>

    {loadingPage?
      <div className="flex items-center justify-center z-0 w-screen h-screen">
        <Loader />
      </div>
    :
      <div className="relative w-full container mx-auto xl:px-24 lg:px-16 px-10 h-fit">


      <div className="pb-8 flex flex-col lg:flex-row gap-4">
        
        <div className="flex-1 text-center lg:hidden">
          <div className="text-2xl font-bold text-black pb-1 lg:hidden block">{t_catalog("catalogue-title-1")}</div>
          <div className="text-sm font-light text-black pb-4 lg:hidden block">{t_catalog("catalogue-release-date-1")}</div>
        </div>
        {loadingAllACR ? (
          <Card
            className="flex items-center justify-center p-8 bg-secondary"
            style={{
              width: isMobile || isTablet ? width : width * 2,
              height,
              minWidth: isMobile ? "300px" : "auto",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-black">
                  {t_catalog('catalogue-loading-1')}
                  </p>
              </div>
            </div>
          </Card>
        ) 
        : 
        pagesAllACR.length > 0 ? (
          <div className="space-y-4">
            <div className="w-full block justify-center relative">
              {/* Left chevron */}
              <div className="w-full flex flex-col items-center" style={{ height }}>
                {/* Flipbook */}
                
                <div
                  className="overflow-hidden"
                  style={{
                    height,
                    maxWidth: isMobile || isTablet ? width : width * 2,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {/* @ts-ignore */}
                  <HTMLFlipBook
                    key={`${isMobile}-${isTablet}-${isSmallDesktop}`}
                    ref={flipBookRefAllACR}
                    width={width}
                    height={height}
                    size="fixed"
                    minWidth={isMobile ? 300 : width}
                    maxWidth={width}
                    minHeight={height}
                    maxHeight={height}
                    showCover={isMobile || isTablet}
                    flippingTime={600}
                    usePortrait={isMobile || isTablet}
                    startPage={0}
                    drawShadow={true}
                    onFlip={(e) => {
                      setCurrentPageAllACR(e.data)
                    }}
                    className="flipbook no-scrollbar"
                    style={{
                      margin: "0 auto",
                      overflow: "hidden",
                    }}
                  >
                    {pagesAllACR.map((pageData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-white shadow-xs"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                      >
                        <LazyImageCustom
                          key={pageData.pageNumber}
                          src={pageData.imageUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${pageData.imageUrl}` : pageData.imageUrl}
                          alt={`Page ${pageData.pageNumber}`}
                          classname="w-full object-contain"
                          width={width}
                          height={height}
                          lazy={index === 0 ? false : true}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>

                {/* Chevron buttons + page counter BELOW flipbook */}
               
              </div> <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={() => goToPrevPage(flipBookRefAllACR)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <span className="text-sm text-gray-600">
                    {t_catalog('catalogue-chevron-page-1')} {currentPageAllACR + 1} {t_catalog('catalogue-chevron-page-2')} {totalPagesAllACR}
                  </span>

                  <Button
                    onClick={() => goToNextPage(flipBookRefAllACR)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
            </div>
          </div>
        ) 
        : 
        renderFallbackCardAllACR()}

        <div className="flex-1 lg:ml-8 lg:text-start text-center">
          <h2 className="text-2xl font-bold text-black pb-1 lg:block hidden">{t_catalog("catalogue-title-1")}</h2>
          <h3 className="text-sm font-light text-black pb-4 lg:block hidden">{t_catalog("catalogue-release-date-1")}</h3>
          <div className="">
            <Button asChild>
              <Link
                href={"https://drive.google.com/file/d/1HkVJr8zb5wM6iJn82ZgAGUi2GLOIMQb5/view?usp=sharing"}
                target="_blank"
              >
                {t_catalog("catalogue-download-button")}
              </Link>
            </Button>
          </div>
        </div>  
      </div>

      <Separator className="p-0.5 bg-foreground mb-8"/>





      <div className="pb-8 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 text-center lg:hidden">
          <div className="text-2xl font-bold text-black pb-1 lg:hidden block">{t_catalog("catalogue-title-2")}</div>
          <div className="text-sm font-light text-black pb-4 lg:hidden block">{t_catalog("catalogue-release-date-2")}</div>
        </div>
        {loadingACROriginal ? (
          <Card
            className="flex items-center justify-center p-8 bg-secondary"
            style={{
              width: isMobile || isTablet ? width : width * 2,
              height,
              minWidth: isMobile ? "300px" : "auto",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-black">
                  {t_catalog('catalogue-loading-2')}
                  </p>
              </div>
            </div>
          </Card>
        ) 
        : 
        pagesACROriginal.length > 0 ? (
          <div className="space-y-4">
            <div className="w-full block justify-center relative">
              {/* Left chevron */}
              <div className="w-full flex flex-col items-center" style={{ height }}>
                {/* Flipbook */}
                <div
                  className="overflow-hidden"
                  style={{
                    height,
                    maxWidth: isMobile || isTablet ? width : width * 2,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {/* @ts-ignore */}
                  <HTMLFlipBook
                    key={`${isMobile}-${isTablet}-${isSmallDesktop}`}
                    ref={flipBookRefACROriginal}
                    width={width}
                    height={height}
                    size="fixed"
                    minWidth={isMobile ? 300 : width}
                    maxWidth={width}
                    minHeight={height}
                    maxHeight={height}
                    showCover={isMobile || isTablet}
                    flippingTime={600}
                    usePortrait={isMobile || isTablet}
                    startPage={0}
                    drawShadow={true}
                    onFlip={(e) => {
                      setCurrentPageACROriginal(e.data)
                    }}
                    className="flipbook no-scrollbar"
                    style={{
                      margin: "0 auto",
                      overflow: "hidden",
                    }}
                  >
                    {pagesACROriginal.map((pageData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-white shadow-xs"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                      >
                        <LazyImageCustom
                          key={pageData.pageNumber}
                          src={pageData.imageUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${pageData.imageUrl}` : pageData.imageUrl}
                          alt={`Page ${pageData.pageNumber}`}
                          classname="w-full object-contain"
                          width={width}
                          height={height}
                          lazy={index === 0 ? false : true}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>

                {/* Chevron buttons + page counter BELOW flipbook */}
               
              </div> <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={() => goToPrevPage(flipBookRefACROriginal)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <span className="text-sm text-gray-600">
                    {t_catalog('catalogue-chevron-page-1')} {currentPageACROriginal + 1} {t_catalog('catalogue-chevron-page-2')} {totalPagesACROriginal}
                  </span>

                  <Button
                    onClick={() => goToNextPage(flipBookRefACROriginal)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
            </div>
          </div>
        ) 
        :
        renderFallbackCardACROriginal()}

        <div className="flex-1 lg:ml-8 lg:text-start text-center">
          <h2 className="text-2xl font-bold text-black pb-1 lg:block hidden">{t_catalog("catalogue-title-2")}</h2>
          <h3 className="text-sm font-light text-black pb-4 lg:block hidden">{t_catalog("catalogue-release-date-2")}</h3>
          <div className="">
            <Button asChild>
              <Link
                href={"https://drive.google.com/file/d/1iM3egFTHC60LlhC8WJCngr6PLeQhCR--/view?usp=sharing"}
                target="_blank"
              >
                {t_catalog("catalogue-download-button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="p-0.5 bg-foreground mb-8"/>





      <div className="pb-8 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 text-center lg:hidden">
          <div className="text-2xl font-bold text-black pb-1 lg:hidden block">{t_catalog("catalogue-title-3")}</div>
          <div className="text-sm font-light text-black pb-4 lg:hidden block">{t_catalog("catalogue-release-date-3")}</div>
        </div>
        {loadingACRFab ? (
          <Card
            className="flex items-center justify-center p-8 bg-secondary"
            style={{
              width: isMobile || isTablet ? width : width * 2,
              height,
              minWidth: isMobile ? "300px" : "auto",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-black">
                  {t_catalog('catalogue-loading-3')}
                  </p>
              </div>
            </div>
          </Card>
        ) 
        : 
        pagesACRFab.length > 0 ? (
          <div className="space-y-4">
             <div className="w-full block justify-center relative">
              {/* Left chevron */}
              <div className="w-full flex flex-col items-center" style={{ height }}>
                {/* Flipbook */}
                <div
                  className="overflow-hidden"
                  style={{
                    height,
                    maxWidth: isMobile || isTablet ? width : width * 2,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {/* @ts-ignore */}
                  <HTMLFlipBook
                    key={`${isMobile}-${isTablet}-${isSmallDesktop}`}
                    ref={flipBookRefACRFab}
                    width={width}
                    height={height}
                    size="fixed"
                    minWidth={isMobile ? 300 : width}
                    maxWidth={width}
                    minHeight={height}
                    maxHeight={height}
                    showCover={isMobile || isTablet}
                    flippingTime={600}
                    usePortrait={isMobile || isTablet}
                    startPage={0}
                    drawShadow={true}
                    onFlip={(e) => {
                      setCurrentPageACRFab(e.data)
                    }}
                    className="flipbook no-scrollbar"
                    style={{
                      margin: "0 auto",
                      overflow: "hidden",
                    }}
                  >
                    {pagesACRFab.map((pageData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-white shadow-xs"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                      >
                        <LazyImageCustom
                          key={pageData.pageNumber}
                          src={pageData.imageUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${pageData.imageUrl}` : pageData.imageUrl}
                          alt={`Page ${pageData.pageNumber}`}
                          classname="w-full object-contain"
                          width={width}
                          height={height}
                          lazy={index === 0 ? false : true}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>

                {/* Chevron buttons + page counter BELOW flipbook */}
               
              </div> <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={() => goToPrevPage(flipBookRefACRFab)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <span className="text-sm text-gray-600">
                    {t_catalog('catalogue-chevron-page-1')} {currentPageACRFab + 1} {t_catalog('catalogue-chevron-page-2')} {totalPagesACRFab}
                  </span>

                  <Button
                    onClick={() => goToNextPage(flipBookRefACRFab)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
            </div>
          </div>
        ) 
        : 
        renderFallbackCardACRFab()}

        <div className="flex-1 lg:ml-8 lg:text-start text-center">
          <h2 className="text-2xl font-bold text-black pb-1 lg:block hidden">{t_catalog("catalogue-title-3")}</h2>
          <h3 className="text-sm font-light text-black pb-4 lg:block hidden">{t_catalog("catalogue-release-date-3")}</h3>
          <div className="">
            <Button asChild>
              <Link
                href={"https://drive.google.com/file/d/1SVg-ro7R9ik5VS0Ytz2R-mjle6Her_Qh/view?usp=sharing"}
                target="_blank"
              >
                {t_catalog("catalogue-download-button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="p-0.5 bg-foreground mb-8"/>





      <div className="pb-8 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 text-center lg:hidden">
          <div className="text-2xl font-bold text-black pb-1 lg:hidden block">{t_catalog("catalogue-title-4")}</div>
          <div className="text-sm font-light text-black pb-4 lg:hidden block">{t_catalog("catalogue-release-date-4")}</div>
        </div>
        {loadingACRSeries ? (
          <Card
            className="flex items-center justify-center p-8 bg-secondary"
            style={{
              width: isMobile || isTablet ? width : width * 2,
              height,
              minWidth: isMobile ? "300px" : "auto",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-black">
                  {t_catalog('catalogue-loading-4')}
                  </p>
              </div>
            </div>
          </Card>
        ) 
        : 
        pagesACRSeries.length > 0 ? (
          <div className="space-y-4">
              <div className="w-full block justify-center relative">
              {/* Left chevron */}
              <div className="w-full flex flex-col items-center" style={{ height }}>
                {/* Flipbook */}
                <div
                  className="overflow-hidden"
                  style={{
                    height,
                    maxWidth: isMobile || isTablet ? width : width * 2,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {/* @ts-ignore */}
                  <HTMLFlipBook
                    key={`${isMobile}-${isTablet}-${isSmallDesktop}`}
                    ref={flipBookRefACRSeries}
                    width={width}
                    height={height}
                    size="fixed"
                    minWidth={isMobile ? 300 : width}
                    maxWidth={width}
                    minHeight={height}
                    maxHeight={height}
                    showCover={isMobile || isTablet}
                    flippingTime={600}
                    usePortrait={isMobile || isTablet}
                    startPage={0}
                    drawShadow={true}
                    onFlip={(e) => {
                      setCurrentPageACRSeries(e.data)
                    }}
                    className="flipbook no-scrollbar"
                    style={{
                      margin: "0 auto",
                      overflow: "hidden",
                    }}
                  >
                    {pagesACRSeries.map((pageData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-white shadow-xs"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                      >
                        <LazyImageCustom
                          key={pageData.pageNumber}
                          src={pageData.imageUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${pageData.imageUrl}` : pageData.imageUrl}
                          alt={`Page ${pageData.pageNumber}`}
                          classname="w-full object-contain"
                          width={width}
                          height={height}
                          lazy={index === 0 ? false : true}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>

                {/* Chevron buttons + page counter BELOW flipbook */}
               
              </div> <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={() => goToPrevPage(flipBookRefACRSeries)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <span className="text-sm text-gray-600">
                    {t_catalog('catalogue-chevron-page-1')} {currentPageACRSeries + 1} {t_catalog('catalogue-chevron-page-2')} {totalPagesACRSeries}
                  </span>

                  <Button
                    onClick={() => goToNextPage(flipBookRefACRSeries)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
            </div>
          </div>
        ) 
        : 
        renderFallbackCardACRSeries()}

        <div className="flex-1 lg:ml-8 lg:text-start text-center">
          <h2 className="text-2xl font-bold text-black pb-1 lg:block hidden">{t_catalog("catalogue-title-4")}</h2>
          <h3 className="text-sm font-light text-black pb-4 lg:block hidden">{t_catalog("catalogue-release-date-4")}</h3>
          <div className="">
            <Button asChild>
              <Link
                href={"https://drive.google.com/file/d/1ThVUoqJ5QVnQQ-ojd1B6beuZU4-A3Moj/view?usp=sharing"}
                target="_blank"
              >
                {t_catalog("catalogue-download-button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="p-0.5 bg-foreground mb-8"/>







      <div className="pb-8 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 text-center lg:hidden">
          <div className="text-2xl font-bold text-black pb-1 lg:hidden block">{t_catalog("catalogue-title-6")}</div>
          <div className="text-sm font-light text-black pb-4 lg:hidden block">{t_catalog("catalogue-release-date-6")}</div>
        </div>
        {loadingACRBlack ? (
          <Card
            className="flex items-center justify-center p-8 bg-secondary"
            style={{
              width: isMobile || isTablet ? width : width * 2,
              height,
              minWidth: isMobile ? "300px" : "auto",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-black">
                  {t_catalog('catalogue-loading-6')}
                  </p>
              </div>
            </div>
          </Card>
        ) 
        : 
        pagesACRBlack.length > 0 ? (
          <div className="space-y-4">
              <div className="w-full block justify-center relative">
              {/* Left chevron */}
              <div className="w-full flex flex-col items-center" style={{ height }}>
                {/* Flipbook */}
                <div
                  className="overflow-hidden"
                  style={{
                    height,
                    maxWidth: isMobile || isTablet ? width : width * 2,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {/* @ts-ignore */}
                  <HTMLFlipBook
                    key={`${isMobile}-${isTablet}-${isSmallDesktop}`}
                    ref={flipBookRefACRBlack}
                    width={width}
                    height={height}
                    size="fixed"
                    minWidth={isMobile ? 300 : width}
                    maxWidth={width}
                    minHeight={height}
                    maxHeight={height}
                    showCover={isMobile || isTablet}
                    flippingTime={600}
                    usePortrait={isMobile || isTablet}
                    startPage={0}
                    drawShadow={true}
                    onFlip={(e) => {
                      setCurrentPageACRBlack(e.data)
                    }}
                    className="flipbook no-scrollbar"
                    style={{
                      margin: "0 auto",
                      overflow: "hidden",
                    }}
                  >
                    {pagesACRBlack.map((pageData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-white shadow-xs"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                      >
                        <LazyImageCustom
                          key={pageData.pageNumber}
                          src={pageData.imageUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${pageData.imageUrl}` : pageData.imageUrl}
                          alt={`Page ${pageData.pageNumber}`}
                          classname="w-full object-contain"
                          width={width}
                          height={height}
                          lazy={index === 0 ? false : true}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>

                {/* Chevron buttons + page counter BELOW flipbook */}
               
              </div> <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={() => goToPrevPage(flipBookRefACRBlack)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <span className="text-sm text-gray-600">
                    {t_catalog('catalogue-chevron-page-1')} {currentPageACRBlack + 1} {t_catalog('catalogue-chevron-page-2')} {totalPagesACRBlack}
                  </span>

                  <Button
                    onClick={() => goToNextPage(flipBookRefACRBlack)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
            </div>
          </div>
        ) 
        : 
        renderFallbackCardACRBlack()}

        <div className="flex-1 lg:ml-8 lg:text-start text-center">
          <h2 className="text-2xl font-bold text-black pb-1 lg:block hidden">{t_catalog("catalogue-title-6")}</h2>
          <h3 className="text-sm font-light text-black pb-4 lg:block hidden">{t_catalog("catalogue-release-date-6")}</h3>
          <div className="">
            <Button asChild>
              <Link
                href={"https://drive.google.com/file/d/1NAB-6zRwF-pUlyTNYL5hNz4498zFqMDI/view?usp=sharing"}
                target="_blank"
              >
                {t_catalog("catalogue-download-button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="p-0.5 bg-foreground mb-8"/>







      <div className="pb-8 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 text-center lg:hidden">
          <div className="text-2xl font-bold text-black pb-1 lg:hidden block">{t_catalog("catalogue-title-5")}</div>
          <div className="text-sm font-light text-black pb-4 lg:hidden block">{t_catalog("catalogue-release-date-5")}</div>
        </div>
        {loadingAllDesibel ? (
          <Card
            className="flex items-center justify-center p-8 bg-secondary"
            style={{
              width: isMobile || isTablet ? width : width * 2,
              height,
              minWidth: isMobile ? "300px" : "auto",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-black">
                  {t_catalog('catalogue-loading-5')}
                  </p>
              </div>
            </div>
          </Card>
        ) 
        : 
        pagesAllDesibel.length > 0 ? (
          <div className="space-y-4">
            <div className="w-full block justify-center relative">
              {/* Left chevron */}
              <div className="w-full flex flex-col items-center" style={{ height }}>
                {/* Flipbook */}
                <div
                  className="overflow-hidden"
                  style={{
                    height,
                    maxWidth: isMobile || isTablet ? width : width * 2,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {/* @ts-ignore */}
                  <HTMLFlipBook
                    key={`${isMobile}-${isTablet}-${isSmallDesktop}`}
                    ref={flipBookRefAllDesibel}
                    width={width}
                    height={height}
                    size="fixed"
                    minWidth={isMobile ? 300 : width}
                    maxWidth={width}
                    minHeight={height}
                    maxHeight={height}
                    showCover={isMobile || isTablet}
                    flippingTime={600}
                    usePortrait={isMobile || isTablet}
                    startPage={0}
                    drawShadow={true}
                    onFlip={(e) => {
                      setCurrentPageAllDesibel(e.data)
                    }}
                    className="flipbook no-scrollbar"
                    style={{
                      margin: "0 auto",
                      overflow: "hidden",
                    }}
                  >
                    {pagesAllDesibel.map((pageData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-white shadow-xs"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                      >
                        <LazyImageCustom
                          key={pageData.pageNumber}
                          src={pageData.imageUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${pageData.imageUrl}` : pageData.imageUrl}
                          alt={`Page ${pageData.pageNumber}`}
                          classname="w-full object-contain"
                          width={width}
                          height={height}
                          lazy={index === 0 ? false : true}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>

                {/* Chevron buttons + page counter BELOW flipbook */}
               
              </div> <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={() => goToPrevPage(flipBookRefAllDesibel)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <span className="text-sm text-gray-600">
                    {t_catalog('catalogue-chevron-page-1')} {currentPageAllDesibel + 1} {t_catalog('catalogue-chevron-page-2')} {totalPagesAllDesibel}
                  </span>

                  <Button
                    onClick={() => goToNextPage(flipBookRefAllDesibel)}
                    className="rounded-full shadow-sm p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
            </div>
          </div>
        ) 
        : 
        renderFallbackCardAllDesibel()}

        <div className="flex-1 lg:ml-8 lg:text-start text-center">
          <h2 className="text-2xl font-bold text-black pb-1 lg:block hidden">{t_catalog("catalogue-title-5")}</h2>
          <h3 className="text-sm font-light text-black pb-4 lg:block hidden">{t_catalog("catalogue-release-date-5")}</h3>
          <div className="">
            <Button asChild>
              <Link
                href={"https://drive.google.com/file/d/1DDbUvKvKAM1Duk6sxl95jUmA5ek1LBxu/view?usp=sharing"}
                target="_blank"
              >
                {t_catalog("catalogue-download-button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>



      </div>
      }

    </>
  )
}
