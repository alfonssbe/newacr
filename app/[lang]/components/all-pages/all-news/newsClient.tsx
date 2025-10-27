"use client"

import { NewsType, SliderDataNews,  } from "@/app/types";
import getAllNews from "@/app/actions/get-all-news";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/app/[lang]/components/ui/breadcrumb";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Loader } from "@/app/[lang]/components/ui/loader";
import { redirect } from "next/navigation";
import AllNewsandFilters from "./news-components/all-filters";

function createFilterProps(
  key: string,
  name: string,
  unit: string,
  filterKey: string,
) {
  return { key, name, unit, filterKey };
}

type Props = {
  news: NewsType[]
}

function removeDuplicates<RangeSliderFilter>(arr: RangeSliderFilter[]): RangeSliderFilter[] {
  return Array.from(new Set(arr));
}

const monthMap: Record<string, string> = {
  'Januari': 'January',
  'Februari': 'February',
  'Maret': 'March',
  'April': 'April',
  'Mei': 'May',
  'Juni': 'June',
  'Juli': 'July',
  'Agustus': 'August',
  'September': 'September',
  'Oktober': 'October',
  'November': 'November',
  'Desember': 'December',
};

export default function News(props: Props) { 
  const t = useTranslations('News Page');
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [allnewsserver, setallnewsserver] = useState<NewsType[]>([])
  const [showserver, setshowserver] = useState<boolean>(true)
  const [sliderRowsFinal, setSliderRowsFinal] = useState<SliderDataNews[]>([])
  useEffect( () => {
    async function fetchData(){
      try {
        const all_Date = props.news.map(news => news.event_date);
        let sliderRows: SliderDataNews[] = [];
        let tempSliderLoop = [];
        let counterShow = 0;
        tempSliderLoop.push(
          createFilterProps('event_date', t('news-timestamps-filter-title'), '', 'eventDate'),
        )
        tempSliderLoop.map((value) =>{
          //@ts-ignore
          const allValueWithoutDuplicates: number[] = removeDuplicates(all_Date);
          const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => !Number.isNaN(number));
          const sortedValues2 = allValueWithoutDuplicatesAndNone.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
          const sortedValues = sortedValues2.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString(t('news-date-format'), { day: '2-digit', month: 'long', year: 'numeric' });
          });
          const timestampsArray: number[] = sortedValues
            .map(dateStr => {
              // Replace Indonesian month with English equivalent
              const parts = dateStr.split(' ');
              const [day, month, year] = parts;
              const englishMonth = monthMap[month];
              if (!englishMonth) return new Date(dateStr).getTime();
              return new Date(`${day} ${englishMonth} ${year}`).getTime();
            })
          .sort((a, b) => a - b);
          if(sortedValues.length>1){
            counterShow+=1
          }
          let newSortedValues : number[] = []
          sortedValues.map((val) =>{
            newSortedValues.push(Number(val))
          })
          sliderRows.push(
            {
              name: value.name, 
              value: timestampsArray,
              realDate: sortedValues,
              unit: value.unit,
              max_index: sortedValues.length - 1,
              min_index: 0,
              minIndex: 0,
              maxIndex: sortedValues.length - 1,
              slug: value.filterKey
            },
          )
        })
        if(counterShow===0){
          setshowserver(false)
        }
        setSliderRowsFinal(sliderRows)
        setallnewsserver(props.news)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
        redirect('/')
      }
    }
    fetchData()
  }, []);
      

  return (
    loading ? 
      <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-foreground z-50">
        <Loader />
      </div>
    :
    allnewsserver &&
    <div className="bg-background -z-10">
      <div className="relative w-full bg-background p-8 h-fit container mx-auto xl:px-24 lg:px-16 px-10 ">
        <div className="pb-6">
          <Breadcrumb>
              <BreadcrumbList>
                  <BreadcrumbItem>
                  <BreadcrumbLink href={locale === 'id' ? '/' : `/${locale}`}>Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                  <BreadcrumbPage>{t('news-breadcrumb')}</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>
        </div>
        {showserver?
            <AllNewsandFilters data={allnewsserver} slider={sliderRowsFinal} showFilters={showserver} />
          :
          <div className="md:grid md:grid-cols-4">
            <AllNewsandFilters data={allnewsserver} slider={sliderRowsFinal} showFilters={showserver} />
          </div>
          }
      </div>
    </div>
  );
}