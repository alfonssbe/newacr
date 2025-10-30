"use client"
import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/types';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Loader } from '@/app/[lang]/components/ui/loader';
import AllDriversandFiltersProducts from '../../../components-all-product/all-filters';
import getAllProductsForFilterPage from '@/app/actions/get-all-products-for-filter-page';

type Props = {
  params: { driverCategory?: string, driversSubCategory?: string, driversSeries?: string }
}

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS_BY_SERIES}`;


function removeDuplicates<RangeSliderFilter>(arr: RangeSliderFilter[]): RangeSliderFilter[] {
  return Array.from(new Set(arr));
}

export default function ProductBySeriesPage(props: Props) {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [showserver, setShowServer] = useState<boolean>(true)
  const [allprodserver, setallprodserver] = useState<AllFilterProductsOnlyType[]>()
  const [sliderRows, setsliderRows] = useState<SliderData[]>([])
  useEffect( () => {
    async function fetchData(){
      try{
        const { driverCategory = '', driversSubCategory = '',  driversSeries = '' } = await props.params;
        const API_EDITED_FIRST = API.replace('{productSubCategory}', driversSubCategory)
        const API_EDITED_NOTFIX = API_EDITED_FIRST.replace('{productSeries}', driversSeries)
        const API_EDITED = API_EDITED_NOTFIX.replace('{productCategory}', driverCategory)
        let [tempData, allSpecsCombined]: [AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>] = await getAllProductsForFilterPage(API_EDITED);
        let sliderRows: SliderData[] = [];
        let checkboxRows: CheckBoxData[] = [];

        let counterShow = 0;

        for (const key in allSpecsCombined) {
          if(key !== 'impedance' && key !== 'program-power'){ 
            if(key !== 'series' && key != "type" && key != "acr-series") {
              const allValueWithoutDuplicates: number[] = removeDuplicates(allSpecsCombined[key].map((val) => Number(val.value)));
              const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => !Number.isNaN(number));
              const sortedValues = allValueWithoutDuplicatesAndNone.slice().sort((a, b) => a - b);
              if(sortedValues.length>1){
                counterShow+=1
              }
              sliderRows.push(
                {
                  name: locale === 'id' ? allSpecsCombined[key][0].childnameIndo : allSpecsCombined[key][0].childnameEnglish, 
                  value: sortedValues, 
                  unit: allSpecsCombined[key][0].unit,
                  max_index: sortedValues.length - 1,
                  min_index: 0,
                  minIndex: 0,
                  maxIndex: sortedValues.length - 1,
                  slug: key
                },
              )
            }
            else{
              const allValueWithoutDuplicates: string[] = removeDuplicates(allSpecsCombined[key].map((val) => val.value));
              const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => number != '');
              const sortedValues = allValueWithoutDuplicatesAndNone.sort()
              if(sortedValues.length>1){
                counterShow+=1
              }
              checkboxRows.push(
                {
                  name: locale === 'id' ? allSpecsCombined[key][0].childnameIndo : allSpecsCombined[key][0].childnameEnglish, 
                  value: sortedValues, 
                  unit: allSpecsCombined[key][0].unit,
                  slug: key,
                },
              )
            }
          }
        }
        if(counterShow===0){
          setShowServer(false)
        }
        setallprodserver(tempData)
        setsliderRows(sliderRows)
        setLoading(false)
      }
        catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData()
  }, []);

  return(
    loading?
      <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-foreground z-50">
        <Loader />
      </div>
      :
    allprodserver &&
    <>
      <div className="w-full bg-white py-8 h-fit">
        <AllDriversandFiltersProducts data={allprodserver} slider={sliderRows} checkbox={[]} showFilters={showserver}/>
      </div>
    </>
  );
}

