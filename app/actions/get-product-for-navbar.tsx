import { ChildSpecificationProp, NavbarFeaturedProduct } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_REACT_APP_FETCH_PRODUCT_FOR_NAVBAR_FEATURED_PRODUCT}`;

const getProductsForNavbar = async (slug: string): Promise<NavbarFeaturedProduct> => {
    const API_EDITED = API.replace('{productSlug}', slug)
    const response = await fetch(API_EDITED);
    if (!response.ok) {
      redirect('/');
      // throw new Error('Failed to fetch navbar featured product');
    }
    const data : NavbarFeaturedProduct = await response.json();
    if (!data) {
      redirect('/');
    }
    return data;
};

export default getProductsForNavbar;

