import { AllCategory, Products, Size, Specifications, SubCategoryFilters } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_FEATURED_PRODUCTS}`;

const getAllFeaturedProducts = async (): Promise<Products[]> => {
  let allFeaturedProducts: Array<Products> = []
  let size = {} as Size;
  let parentSize: Array<number> = []
  const response = await fetch(API);
  if (!response.ok) {
    redirect('/');
    // throw new Error('Failed to fetch featured products');
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
 

    let specific: Specifications = {
      diameter_speaker: "",
      daya_maksimum: "",
      lebar_daerah_frekuensi: "",
      spl: data[i].specification.spl,
      medan_magnet: "",
      berat_magnet: "",
      voice_coil_diameter: "",
      impedansi: data[i].specification.impedansi,
      nominal_power_handling: "",
      program_power: data[i].specification.program_power,
      voice_coil_material: "",
      berat_speaker: "",
      custom_note: "",
      deskripsi_sparepart: "",
      isi_per_dus_sparepart: "",
    }

    let tempSeries: Array<AllCategory> = []
    let tempCat: Array<AllCategory> = []
    let tempSubCat: Array<AllCategory> = []
    let tempSubSubCat: Array<AllCategory> = []
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
      let product: Products = {id: data[i].id,
        coverUrl: data[i].cover_img[0].url,
        CoverAlt: data[i].slug,
        series: tempSeries,
        name: data[i].name,
        slug: data[i].slug,
        size: size,
        categories: tempCat,
        sub_categories: tempSubCat,
        sub_sub_categories: tempSubSubCat,
        specification: specific
      }
      allFeaturedProducts.push(product)
    }
  }
  return allFeaturedProducts;
};

export default getAllFeaturedProducts;

