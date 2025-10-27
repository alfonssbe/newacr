import { AllCategory, Products, Size, Specifications, SubCategoryFilters } from "@/app/types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS}`;

const getAllProductsJsonld = async (): Promise<Products[]> => {
  let allProducts: Array<Products> = []

  let size = {} as Size;
  let parentSize: Array<number> = []
  
  let allSubSubCategory: Array<string> = []
  let allSubCategory: Array<string> = []
  let allSeries: Array<string> = []

  const response = await fetch(API, {cache: "no-store"});
  if (!response.ok) {
    redirect('/');
    // throw new Error(`Failed to fetch all products`);
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }
  for (let i = 0; i < data.length; i++) {
    //Size
    if(data[i].size!=null){
      let size2: Size = {
        label: data[i].size.value,
        value: Number(data[i].size.name)
      }
      if (!parentSize.some((size) => size === size2.value)) {
        parentSize.push(size2.value);
      }
      size = size2
    }
    //Sub Sub Category
    data[i].allCat.map((value: SubCategoryFilters) => {
      if(value.type === "Sub Sub Category"){
        allSubSubCategory.push(value.name)
      }
      else if (value.type === "Sub Category"){
        allSubCategory.push(value.name)
      }
      else if (value.type === "Series"){
        allSeries.push(value.name)
      }
    })

    let specific: Specifications = {
      diameter_speaker: "",
      daya_maksimum: "",
      lebar_daerah_frekuensi: "",
      spl: "",
      medan_magnet: "",
      berat_magnet: "",
      voice_coil_diameter: "",
      impedansi: "",
      nominal_power_handling: "",
      program_power: "",
      voice_coil_material: "",
      berat_speaker: "",
      custom_note: "",
      deskripsi_sparepart: "",
      isi_per_dus_sparepart: "",
    }

    let tempCat: Array<AllCategory> = []
    let tempSubCat: Array<AllCategory> = []
    let tempSubSubCat: Array<AllCategory> = []
    let tempSeries: Array<AllCategory> = []
    data[i].allCat && data[i].allCat.map((value: SubCategoryFilters) => {
      if(value.type === "Category"){
        tempCat.push({
          id: value.id,
          name: value.name,
          slug: value.slug
        })
      }
      else if(value.type === "Sub Category"){
        tempSubCat.push({
          id: value.id,
          name: value.name,
          slug: value.slug
        })
      }
      else if(value.type === "Sub Sub Category"){
        tempSubSubCat.push({
          id: value.id,
          name: value.name,
          slug: value.slug
        })
      }
      else if(value.type === "Series"){
        tempSeries.push({
          id: value.id,
          name: value.name,
          slug: value.slug
        })
      }
    })

    if(data[i].cover_img.length>0){
      let product: Products = {
        id: data[i].id,
        coverUrl: data[i].cover_img[0].url,
        CoverAlt: data[i].slug,
        name: data[i].name,
        slug: data[i].slug,
        size: size,
        series: tempSeries,
        categories: tempCat,
        sub_categories: tempSubCat,
        sub_sub_categories: tempSubSubCat,
        specification: specific
      }
      allProducts.push(product)
    }
  }

  return allProducts;
};

export default getAllProductsJsonld;

