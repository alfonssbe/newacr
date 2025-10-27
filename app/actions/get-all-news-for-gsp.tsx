const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_NEWS_FOR_GSP}`;

const getAllNewsGSP = async (): Promise<string[][]> => {
  const response = await fetch(API, {cache: "no-store"});
  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  if (!data) {
    return [];
  }
  let indoSlug: string[] = []
  let enSlug: string[] = []
  data.map((val: any) => {
    indoSlug.push(val.slug)
    enSlug.push(val.slug_english)
  })

  return [indoSlug, enSlug];
};

export default getAllNewsGSP;

