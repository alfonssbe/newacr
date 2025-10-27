import { redirect } from "next/navigation";
import { AllFilterProductsOnlyType, ChildSpecificationProp, specForProductCardProps } from "../types";

const getAllProductsForFilterPage = async (api: string): Promise<[AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>]> => {

  let allSizes : string[] = []
  const response = await fetch(api);
  if (!response.ok) {
    redirect('/');
    // throw new Error(`Failed to fetch products by ${subsubcategory}`);
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }

  let allSpecs: Record<string, ChildSpecificationProp[]> = data.allSpecsCombined
  let tempSize: ChildSpecificationProp[] = []
  let finalTemp: AllFilterProductsOnlyType[] = []
  data.products.map((val: any) => {
    tempSize.push({
      childnameEnglish: "Size",
      childnameIndo: "Ukuran",
      value: val.size.name,
      slugEnglish: 'size',
      slugIndo: 'ukuran',
      notes: '',
      unit: `"`
    })
    allSizes.push(val.size.name)
    let alltempSpec: ChildSpecificationProp[] = []
    val.connectorSpecifications.map((spec: any) => {
      let tempSpec: ChildSpecificationProp = {
        childnameEnglish: spec.dynamicspecification.nameEnglish,
        childnameIndo: spec.dynamicspecification.nameIndo,
        value: spec.value,
        slugEnglish: spec.dynamicspecification.slugEnglish,
        slugIndo: spec.dynamicspecification.slugIndo,
        notes: spec.notes,
        unit: spec.dynamicspecification.unit
      }
      alltempSpec.push(tempSpec)
    })

    for (const key in allSpecs) {
      if (key === 'type'){
        val.allCat.map((cat: any) => {
          if(cat.type === 'Sub Sub Category') {
            let tempSpec: ChildSpecificationProp = {
              childnameEnglish: "Type",
              childnameIndo: "Tipe",
              value: cat.name,
              slugEnglish: "type",
              slugIndo: "tipe",
              notes: '',
              unit: ''
            }
            alltempSpec.push(tempSpec)
          }
        })
      }
      else if (key === 'series'){
        val.allCat.map((cat: any) => {
          if(cat.type === 'Sub Category') {
            let tempSpec: ChildSpecificationProp = {
              childnameEnglish: "Series",
              childnameIndo: "Seri",
              value: cat.name,
              slugEnglish: "series",
              slugIndo: "seri",
              notes: '',
              unit: ''
            }
            alltempSpec.push(tempSpec)
          }
        })
      }
      else if (key === 'series-acr'){
        val.allCat.map((cat: any) => {
          if(cat.type === 'Series') {
            let tempSpec: ChildSpecificationProp = {
              childnameEnglish: "Series ACR",
              childnameIndo: "Seri ACR",
              value: cat.name,
              slugEnglish: "series-acr",
              slugIndo: "seri-acr",
              notes: '',
              unit: ''
            }
            alltempSpec.push(tempSpec)
          }
        })
      }
    }

    let temp: AllFilterProductsOnlyType = {
      products: {
        id: val.id,
        name: val.name,
        slug: val.slug,
        cover_img: {
          url: val.cover_img[0].url
        },
        allCat: val.allCat,
        spec: {
          sensitivity : alltempSpec.find((val) => val.slugEnglish === 'sensitivity') ?? null,
          impedance : alltempSpec.find((val) => val.slugEnglish === 'impedance') ?? null,
          programpower : alltempSpec.find((val) => val.slugEnglish === 'program-power') ?? null
        }
      },
      size: {
        name: val.size.value,
        value: val.size.name
      },
      specs: alltempSpec
    }
    finalTemp.push(temp)
  })

  allSpecs['size'] = tempSize
  for (const key in allSpecs) {
    if (allSpecs[key].length === 0) {
      delete allSpecs[key]
    }
  }
  

  return [finalTemp, allSpecs];
};

export default getAllProductsForFilterPage;

