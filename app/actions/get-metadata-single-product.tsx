import { MetadataSingleProducts, Size } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_METADATA_SINGLE_PRODUCT}`;

const getSingleMetadata = async (productSlug: string, lang: string): Promise<MetadataSingleProducts> => {
  const API_EDITED = API.replace('{productSlug}', productSlug)
  const response = await fetch(API_EDITED!);
  if (!response.ok) {
    redirect('/');
    // throw new Error('Failed to fetch one product');
  }
  const data = await response.json();
    if (!data) {
      redirect('/');
    }
  if (data){
    let size = {} as Size;
    if(data.size!=null){
      let size2: Size = {
        label: data.size.value,
        value: Number(data.size.name)
      }
      size = size2  
    }

    let product: MetadataSingleProducts = {
      coverUrl: data.cover_img[0].url,
      coverAlt: data.slug,
      name: data.name,
      slug: data.slug,
      size: size 
    }
    
    return product;
  }
  let product: MetadataSingleProducts = {
    coverUrl: "",
    coverAlt: "",
    name: "",
    slug: "",
    size: {
      value:0,
      label:'',
    }
  }
  return product;
};

export default getSingleMetadata;

