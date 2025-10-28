import NotFound from "@/app/not-found";
import ProductBySubCategoryPageJsonLd from "../../components/all-pages/all-drivers/subDrivers/subDrivers";
import SingleNewsPageJsonLd from "../../components/all-pages/all-news/single-news/singleNews";

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
    case 'spareparts':
    case 'sparepart':
      return <ProductBySubCategoryPageJsonLd params={{ lang, driverCategory: slug, driversSubCategory: subslug }} />;
    default:
      <></>
  }
}