import { AllProductsJsonType } from "@/app/types";
import { redirect } from "next/navigation";

const getAllProductsJsonld = async (api: string): Promise<AllProductsJsonType[]> => {
  const response = await fetch(api, {cache: "no-store"});
  if (!response.ok) {
    redirect('/');
    // throw new Error(`Failed to fetch all products`);
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }
  
  return data;
};

export default getAllProductsJsonld;

