import { Hero } from "../types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_HERO}`;

const getAllHero = async (lang: string): Promise<Hero[]> => {
  let allHero: Array<Hero> = []
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
    if(data[i].hero_img.length>0){
      let product: Hero = {
        id: data[i].id,
        name: lang === 'id' ? data[i].nameIndo : data[i].nameEnglish,
        featuredDesc: lang === 'id' ? data[i].featuredDescIndo : data[i].featuredDescEnglish,
        slug: lang === 'id' ? data[i].slugIndo : data[i].slugEnglish,
        imgUrl: data[i].hero_img[0].url,
        buttonDesc: lang === 'id' ? data[i].buttonDescIndo : data[i].buttonDescEnglish,
        buttonLink: lang === 'id' ? data[i].buttonLinkUrl : data[i].buttonLinkUrlEnglish,
      }
      allHero.push(product)
    }
  }
  return allHero;
};

export default getAllHero;

