import ProductBySubSubCategoryPageJsonLd from "@/app/[lang]/components/all-pages/all-drivers/subDrivers/seriesDrivers/subSubDrivers/subSubDrivers";
import SparepartBySubSubCategoryPageJsonLd from "@/app/[lang]/components/all-pages/all-spareparts/subSpareparts/seriesSpareparts/subSubSpareparts/subSubSpareparts";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ dynamicroute: string; subdynamicroute: string; subsubdynamicroute: string; subsubsubdynamicroute: string; lang: string }>;
}) {
  const { dynamicroute: slug, subdynamicroute: subslug, subsubdynamicroute: subsubseries, subsubsubdynamicroute: subsubsubslug, lang } = await params;  
  switch (slug) {
    case 'drivers':
    case 'driver':
      return <ProductBySubSubCategoryPageJsonLd params={{ lang, driversSubCategory: subslug, driversSeries: subsubseries, driversSubSubCategory: subsubsubslug }} />;
    case 'spareparts':
    case 'sparepart':
      return <SparepartBySubSubCategoryPageJsonLd params={{ lang, sparepartSubCategory: subslug, sparepartSeries: subsubseries, sparepartSubSubCategory: subsubsubslug }} />;
    default:
      <></>
  }
}