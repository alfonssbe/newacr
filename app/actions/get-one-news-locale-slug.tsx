import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ONE_NEWS_SLUG_LOCALE}`;

const getOneNewsLocaleSlug = async (slug: string, lang: string): Promise<string> => {

  const API_EDITED = API.replace('{newsSlug}', slug)
  const API_EDITED2 = API_EDITED.replace('{lang}', lang)
  const response = await fetch(API_EDITED2, {cache: "no-store"});
  if (!response.ok) {
    redirect('/');
    // throw new Error(`Failed to fetch news`);
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }
    
  return data;
};

export default getOneNewsLocaleSlug;

