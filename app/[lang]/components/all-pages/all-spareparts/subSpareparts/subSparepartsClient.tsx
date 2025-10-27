"use client"
import { CheckBoxData, Products, SliderData } from "@/app/types";
import getAllProductsBySubCategory from "@/app/actions/get-all-products-by-sub-category";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader } from "@/app/[lang]/components/ui/loader";
import getAllSparepartBySubCategory from "@/app/actions/get-all-spareparts-by-sub-category";
import AllDriversandFiltersProducts from "../../components-all-product/all-filters";

type Props = {
  params: { sparepartSubCategory?: string }
}

function createFilterProps(
  key: string,
  name: string,
  unit: string,
  filterKey: string,
) {
  return { key, name, unit, filterKey };
}

function removeDuplicates<RangeSliderFilter>(arr: RangeSliderFilter[]): RangeSliderFilter[] {
  return Array.from(new Set(arr));
}

export default function SparepartBySubCategoryPage(props: Props) {        
        const t = useTranslations("All Filters")
        const [loading, setLoading] = useState<boolean>(true)
        const [showserver, setShowServer] = useState<boolean>(true)
        const [allprodserver, setallprodserver] = useState<Products[]>()
        const [sliderRows, setsliderRows] = useState<SliderData[]>([])
        const [checkboxRows, setcheckboxRows] = useState<CheckBoxData[]>([])
        useEffect( () => {
          async function fetchData(){
            try{
              const { sparepartSubCategory = '' } = await props.params;
              let tempData = await getAllSparepartBySubCategory(sparepartSubCategory);
              let sliderRows: SliderData[] = [];
              let checkboxRows: CheckBoxData[] = [];
              let tempSliderLoop = [];
              let tempCheckboxLoop = [];
              let counterShow = 0;
              tempSliderLoop.push(
                createFilterProps('parentSize', t('all-filters-slider-diameter-cone'), 'inch', 'size'),
                createFilterProps('allSPL', t('all-filters-slider-sensitivity'), 'dB', 'spl'),
                createFilterProps('allVoiceCoilDiameter', t('all-filters-slider-diameter-voice-coil'), 'mm', 'voice_coil_diameter'),
              )
              tempSliderLoop.map((value) =>{
                if(value.key==='parentSize'){
                  //@ts-ignore
                  const allValueWithoutDuplicates: number[] = removeDuplicates(tempData.allsizes);
                  const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => !Number.isNaN(number));
                  const sortedValues = allValueWithoutDuplicatesAndNone.slice().sort((a, b) => a - b);
                  if(sortedValues.length>1){
                    counterShow+=1
                  }
                  sliderRows.push(
                    {
                      name: value.name, 
                      value: sortedValues, 
                      unit: value.unit,
                      max_index: sortedValues.length - 1,
                      min_index: 0,
                      minIndex: 0,
                      maxIndex: sortedValues.length - 1,
                      slug: value.filterKey
                    },
                  )
                }
                else{
                  //@ts-ignore
                  const allValueWithoutDuplicates: number[] = removeDuplicates(tempData.allproduct[value.key]);
                  const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => !Number.isNaN(number));
                  const sortedValues = allValueWithoutDuplicatesAndNone.slice().sort((a, b) => a - b);
                  if(sortedValues.length>1){
                    counterShow+=1
                  }
                  sliderRows.push(
                    {
                      name: value.name, 
                      value: sortedValues, 
                      unit: value.unit,
                      max_index: sortedValues.length - 1,
                      min_index: 0,
                      minIndex: 0,
                      maxIndex: sortedValues.length - 1,
                      slug: value.filterKey
                    },
                  )
                }
              })

              tempCheckboxLoop.push(
                // createFilterProps('allSubCategory', 'Series', '', 'series'),
                createFilterProps('allSubSubCategory', t('all-filters-checkbox-type'), '', 'sub_sub_category'),
              )
              tempCheckboxLoop.map((value) =>{
                //@ts-ignore
                const allValueWithoutDuplicates: string[] = removeDuplicates(tempData.allproduct[value.key]);
                const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => number != '');
                const sortedValues = allValueWithoutDuplicatesAndNone.sort()
                if(sortedValues.length>1){
                  counterShow+=1
                }
                checkboxRows.push(
                  {
                    name: value.name, 
                    value: sortedValues, 
                    unit: value.unit,
                    slug: value.filterKey,
                  },
                )
              })

              if(counterShow===0){
                setShowServer(false)
              }
              setallprodserver(tempData.allproduct.allProducts)
              setsliderRows(sliderRows)
              setcheckboxRows(checkboxRows)
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
        <AllDriversandFiltersProducts data={allprodserver} slider={sliderRows} checkbox={checkboxRows} showFilters={showserver}/>
      </div>
    </>
  );
}