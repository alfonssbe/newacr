import { AllFilterProductsOnlyType, ChildSpecificationProp } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_FEATURED_PRODUCTS}`;

const getAllFeaturedProducts = async (): Promise<AllFilterProductsOnlyType[]> => {
  
    let allSizes : string[] = []
    const response = await fetch(API);
    if (!response.ok) {
      redirect('/');
      // throw new Error(`Failed to fetch products by ${subsubcategory}`);
    }
    const data = await response.json();
    if (!data) {
      redirect('/');
    }
  
    let tempSize: ChildSpecificationProp[] = []
    let finalTemp: AllFilterProductsOnlyType[] = []
    data.map((val: any) => {
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
  
    return finalTemp;
};

export default getAllFeaturedProducts;

