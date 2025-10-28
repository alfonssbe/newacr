"use client"

import Link from "next/link";
import { FileDown } from "lucide-react";
import SwiperCarouselCoverandCatalogues from "@/app/[lang]/components/ui/swipercarouselcoverandcatalogues";
import { Separator } from "@/components/ui/separator";
import SwiperCarouselGraphImpedance from "@/app/[lang]/components/ui/swipercarouselgraphimpedance";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/app/[lang]/components/ui/breadcrumb";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SingleProducts } from "@/app/types";
import { Loader } from "@/app/[lang]/components/ui/loader";
import { Button } from "@/components/ui/button";
import DOMPurify from 'dompurify';
import SpecificationTable from "../../components/spec-table";

type Props = {
  prod: SingleProducts
}

const all_desc_style = "text-left xl:text-base sm:text-sm text-xs text-black p-0 py-1"
const all_title_style = "text-left font-bold xl:text-4xl text-2xl text-black"
const all_sub_title_style = "text-2xl text-gray-500 font-bold py-4"

export default function SingleProduct(props: Props) {     
    const t = useTranslations("Single Product Page")
    const [data, setData] = useState<SingleProducts>()
    const [loading, setLoading] = useState<boolean>(true)
    const locale = useLocale()
    useEffect( () => {
        async function fetchData(){
            try{
                // const { productSlug = '' } = await props.params;
                setData(props.prod)
                setLoading(false)
            }
                catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData()
    }, []);
    
    return(
        <div className="container mx-auto xl:px-24 lg:px-16 px-10 xl:py-8 lg:py-6 py-4">
            
            {loading ? 
            <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-foreground z-50">
                <Loader />
            </div>
            :
            data &&
                <>
                    <div className="pb-6">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                <BreadcrumbLink href={locale === 'id' ? '/' : `/${locale}`}>Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                {data.categories.length > 0 && 
                                    <>
                                        <BreadcrumbItem>
                                        <BreadcrumbLink href={locale === 'id' ? `/${data.categories[0].slug}` : `/${locale}/${data.categories[0].slug}`}>{data.categories[0].name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </>
                                }
                                {data.categories.length > 0 && data.sub_categories.length > 0 && 
                                    <>
                                        <BreadcrumbItem>
                                        <BreadcrumbLink href={locale === 'id' ? `/${data.categories[0].slug}/${data.sub_categories[0].slug}` : `/${locale}/${data.categories[0].slug}/${data.sub_categories[0].slug}`}>{data.sub_categories[0].name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </>
                                }
                                {data.categories.length > 0 && data.sub_categories.length > 0 && data.series.length > 0 && data.sub_categories.some(sub => sub.name === "ACR") &&
                                    <>
                                        <BreadcrumbItem>
                                        <BreadcrumbLink href={locale === 'id' ? `/${data.categories[0].slug}/${data.sub_categories[0].slug}/${data.series[0].slug}` : `/${locale}/${data.categories[0].slug}/${data.sub_categories[0].slug}/${data.series[0].slug}`}>{data.series[0].name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </>
                                }
                                {data.categories.length > 0 && data.sub_categories.length > 0 && data.series.length > 0 && data.sub_categories.some(sub => sub.name === "ACR") && data.sub_sub_categories.length > 0 && 
                                    <>
                                        <BreadcrumbItem>
                                        <BreadcrumbLink href={locale === 'id' ? `/${data.categories[0].slug}/${data.sub_categories[0].slug}/${data.series[0].slug}/${data.sub_sub_categories[0].slug}` : `/${locale}/${data.categories[0].slug}/${data.sub_categories[0].slug}/${data.series[0].slug}/${data.sub_sub_categories[0].slug}`}>{data.sub_sub_categories[0].name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </>
                                }
                                <BreadcrumbItem>
                                <BreadcrumbPage>{data.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="block md:flex">
                        {/* Right Column for Typography */}
                        <div className="md:order-2 order-1 md:w-1/2 justify-center md:h-1/2 block w-full h-full md:pl-2 md:pb-0 pb-4">
                            <div className="flex flex-col w-full">
                                <div>
                                    <div className="w-full h-fit pb-4">
                                        <SwiperCarouselCoverandCatalogues cover={data.coverImg} image_catalogues={data.images_Catalogues} />
                                    </div>
                                    {/* {(data.drawing_Url || data.graph_Url || data.impedance_Url) && data.name && ( */}
                                    <div className="w-full h-fit pb-4">
                                        <SwiperCarouselGraphImpedance drawing={data.drawing} graph={data.graph} impedance={data.impedance} />
                                    </div>
                                    {/* )} */}

                                    {data.datasheet.length > 0 && (
                                        <div className="pt-4">
                                            <Button asChild className="w-full" variant="default" size="default">
                                                <Link href={data.datasheet[0].url} target="_blank">
                                                    <div className="flex gap-1">
                                                        <FileDown size={20} />
                                                        {t("single-product-button-download-manual")}
                                                    </div>
                                                </Link>
                                            </Button>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <Button asChild className="w-full" variant="default" size="default">
                                            <Link
                                                href={{
                                                pathname: locale === 'id' ? '/komparasi' : `/${locale}/comparison`,
                                                query: { product1slug: data?.slug },
                                                }}
                                            >
                                                {t('single-product-button-comparison')}
                                            </Link>
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Left Column for Images */}
                        <div className="md:order-1 order-2 md:w-1/2 md:h-1/2 block w-full h-full pr-2">
                            {data.sub_sub_categories && (
                                <div className={`${data.sub_sub_categories.length != 0 ? 'flex' : 'hidden'}`}>
                                    {data.sub_sub_categories.map((subsubcategory: any, index: number) => (
                                        <div key={index} className={`${all_sub_title_style}`}>
                                            {index === data.sub_sub_categories.length - 1? subsubcategory.name : subsubcategory.name.concat("- ")}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {data.name && <h1 className={`${all_title_style} pb-4`}>{data.name}</h1>}

                            {data.sub_sub_categories && (
                                <h2 className={`sr-only`}>
                                    {data.sub_sub_categories.map((subsubcategory: any, index: number) => (
                                        index === data.sub_sub_categories.length - 1? subsubcategory.name : subsubcategory.name.concat(" - ")
                                    ))}
                                </h2>
                            )}

                            <Separator className="bg-primary w-56 h-2" />

                            {data.desc && data.desc != '' && data.desc != '-' && data.desc != '<p></p>' && data.desc != '<p>-</p>' && (
                                <div className="pb-4">
                                    <h2 className={`${all_sub_title_style}`}>
                                    {t("single-product-features")}
                                    </h2>
                                    <h3 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.desc, {
                                        ALLOWED_TAGS: [
                                            'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                                        ],
                                        ALLOWED_ATTR: [
                                            'href', 'target', 'rel', 'class', 'id', 'style'
                                        ],
                                    }) }}>
                                    </h3>
                                </div>
                            )}

                            {data.specification && data.specification.length > 0 &&
                                <div className="justify-start pt-4">
                                    <SpecificationTable spec={data.specification} styling={all_desc_style} stylingTitle={all_sub_title_style} locale={locale}/>
                                </div>
                            }
                        </div>
                    </div>
                </>
        }

        </div>
    );
}