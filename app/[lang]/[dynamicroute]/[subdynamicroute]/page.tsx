import NotFound from "@/app/not-found";
import ProductBySubCategoryPageJsonLd from "../../components/all-pages/all-drivers/subDrivers/subDrivers";
import SingleNewsPageJsonLd from "../../components/all-pages/all-news/single-news/singleNews";
import SparepartBySubCategoryPageJsonLd from "../../components/all-pages/all-spareparts/subSpareparts/subSpareparts";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ dynamicroute: string; subdynamicroute: string; lang: string }>;
}) {
  const { dynamicroute: slug, subdynamicroute: subslug, lang } = await params;  
  switch (slug) {
    case 'news':
    case 'berita':
      return <SingleNewsPageJsonLd params={{ lang, newsSlug: subslug }} />;
    case 'drivers':
    case 'driver':
      return <ProductBySubCategoryPageJsonLd params={{ lang, driversSubCategory: subslug }} />;
    case 'spareparts':
    case 'sparepart':
      return <SparepartBySubCategoryPageJsonLd params={{ lang, sparepartSubCategory: subslug }} />;
    // case 'products':
    // case 'produk':
    //   return <SingleProductJsonLd params={{lang, productSlug: subslug}}/>;
    default:
      <></>
  }
}