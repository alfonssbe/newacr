import { redirect } from "next/navigation";
import { NewsType } from "../types";


const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_NEWS}`;

const getAllNews = async (totalNews: string, lang: string): Promise<NewsType[]> => {
  let allNews: Array<NewsType> = []

  const API_EDITED = API.replace('{totalNews}', totalNews)
  const response = await fetch(API_EDITED, {cache: "no-store"});
  if (!response.ok) {
    redirect('/');
    // throw new Error(`Failed to fetch news`);
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }
  for (let i = 0; i < data.length; i++) {
    if(data[i].news_img.length>0){
      let product: NewsType = {
        id: data[i].id,
        title: lang === 'id' ? data[i].title : data[i].title_english,
        slug: lang === 'id' ? data[i].slug : data[i].slug_english,
        link_placeholder: data[i].link_placeholder,
        link_url: data[i].link_url,
        description: lang === 'id' ? data[i].description : data[i].description_english,
        news_img_url: data[i].news_img[0].url,
        event_date: data[i].event_date,
        updatedAt: data[i].updatedAt
      }
      allNews.push(product)
    }
  }

  return allNews;
};

export default getAllNews;

