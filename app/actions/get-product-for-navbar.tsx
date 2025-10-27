import { NavbarFeaturedProduct } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_REACT_APP_FETCH_PRODUCT_FOR_NAVBAR_FEATURED_PRODUCT}`;

const getProductsForNavbar = async (slug: string): Promise<NavbarFeaturedProduct> => {
    let productForNavbar: Array<NavbarFeaturedProduct> = [];
    const API_EDITED = API.replace('{productSlug}', slug)
    const response = await fetch(API_EDITED);
    if (!response.ok) {
      redirect('/');
      // throw new Error('Failed to fetch navbar featured product');
    }
    const data = await response.json();
      if (!data) {
        redirect('/');
      }
    for (let i = 0; i < data.length; i++) {
        if(data[i].url.length>0){
            const normalizedStr = data[i].label.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, ' inch');
            let combined_val = normalizedStr.concat(" ", data[i].value)
            let temp: NavbarFeaturedProduct = {
                value: combined_val,
                label: data[i].label,
                slug: data[i].slug,
                url: data[i].url[0].url,
                categoryDetails: data[i].categoryDetails,
                series: data[i].series,
                subcat: data[i].subcat,
                haveSparepart: data[i].haveSparepart,
                spec: {
                  diameter_speaker: "",
                  daya_maksimum: "",
                  lebar_daerah_frekuensi: data[i].spec.lebar_daerah_frekuensi,
                  spl:  data[i].spec.spl,
                  medan_magnet: "",
                  berat_magnet: "",
                  voice_coil_diameter:  data[i].spec.voice_coil_diameter,
                  impedansi:  data[i].spec.impedansi,
                  nominal_power_handling:  data[i].spec.nominal_power_handling,
                  program_power:  data[i].spec.program_power,
                  voice_coil_material: "",
                  berat_speaker: "",
                  custom_note: "",
                  deskripsi_sparepart: "",
                  isi_per_dus_sparepart: "",
                }
            };
            productForNavbar.push(temp);
        }
    }
    return productForNavbar[0];
};

export default getProductsForNavbar;

