import { Searchbox } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_REACT_APP_FETCH_PRODUCT_FOR_SEARCHBOX}`;

const getProductsForSearchbox = async (): Promise<Searchbox[]> => {
    let productForSearchbox: Array<Searchbox> = [];
    const response = await fetch(API);
    if (!response.ok) {
      redirect('/');
      // throw new Error('Failed to fetch searchbox');
    }
    const data = await response.json();
    if (!data) {
      redirect('/');
    }
    for (let i = 0; i < data.length; i++) {
        if(data[i].url.length>0){
            const normalizedStr = data[i].label.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, ' inch');
            let combined_val = normalizedStr.concat(" ", data[i].value)
            let temp: Searchbox = {
                value: combined_val,
                label: data[i].label,
                slug: data[i].slug,
                url: data[i].url[0].url,
                categoryDetails: data[i].categoryDetails
            };
            productForSearchbox.push(temp);
        }
    }
    productForSearchbox.sort((a, b) => {
      // Allow optional space OR dash before Mk
      const mkA = a.label.match(/[-\s]?Mk\s*(\d+)/i);
      const mkB = b.label.match(/[-\s]?Mk\s*(\d+)/i);

      const numA = mkA ? parseInt(mkA[1], 10) : -1;
      const numB = mkB ? parseInt(mkB[1], 10) : -1;

      // Remove Mk part (with dash or space) for base name comparison
      const baseA = a.label.replace(/[-\s]?Mk\s*\d+/i, '').trim();
      const baseB = b.label.replace(/[-\s]?Mk\s*\d+/i, '').trim();

      const nameCompare = baseA.localeCompare(baseB);
      if (nameCompare !== 0) {
        return nameCompare;
      }

      if (numA === -1 && numB !== -1) return 1;
      if (numB === -1 && numA !== -1) return -1;

      return numB - numA;
    });

    return productForSearchbox;
};

export default getProductsForSearchbox;

