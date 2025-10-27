import { NavbarCategory, NavbarProducts } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_NAVBAR_CONTENT}`;

const getAllNavbarContent = async (): Promise<NavbarProducts[]> => {
  let allNavbarProducts: Array<NavbarProducts> = []

  const response = await fetch(API);
  if (!response.ok) {
    redirect('/');
    // throw new Error('Failed to fetch navbar products');
  }
  const data = await response.json();
    if (!data) {
      redirect('/');
    }
  for (let i = 0; i < data.length; i++) {
    if(data[i].url.length>0){
      let allNavbarCat: Array<NavbarCategory> = []
      for(let j = 0; j < data[i].categories.length; j++){
        let cat: NavbarCategory = {
          name: data[i].categories[j].name,
          type: data[i].categories[j].type,
        }
        allNavbarCat.push(cat)
      }
      let product: NavbarProducts = {
        name: data[i].productName,
        href: "/products/".concat(data[i].productSlug),
        categories: allNavbarCat,
        url: data[i].url[0].url,
        slug: data[i].productSlug,
        haveSparepart: data[i].haveSparepart
      }
      allNavbarProducts.push(product)
    }
  }

  allNavbarProducts.sort((a, b) => {
    // Allow optional space OR dash before Mk
    const mkA = a.name.match(/[-\s]?Mk\s*(\d+)/i);
    const mkB = b.name.match(/[-\s]?Mk\s*(\d+)/i);

    const numA = mkA ? parseInt(mkA[1], 10) : -1;
    const numB = mkB ? parseInt(mkB[1], 10) : -1;

    // Remove Mk part (with dash or space) for base name comparison
    const baseA = a.name.replace(/[-\s]?Mk\s*\d+/i, '').trim();
    const baseB = b.name.replace(/[-\s]?Mk\s*\d+/i, '').trim();

    const nameCompare = baseA.localeCompare(baseB);
    if (nameCompare !== 0) {
      return nameCompare;
    }

    if (numA === -1 && numB !== -1) return 1;
    if (numB === -1 && numA !== -1) return -1;

    return numB - numA;
  });


  return allNavbarProducts;
};

export default getAllNavbarContent;

