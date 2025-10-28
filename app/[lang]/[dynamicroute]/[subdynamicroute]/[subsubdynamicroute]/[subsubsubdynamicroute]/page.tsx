import ProductBySubSubCategoryPageJsonLd from "@/app/[lang]/components/all-pages/all-drivers/subDrivers/seriesDrivers/subSubDrivers/subSubDrivers";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ dynamicroute: string; subdynamicroute: string; subsubdynamicroute: string; subsubsubdynamicroute: string; lang: string }>;
}) {
  const { dynamicroute: slug, subdynamicroute: subslug, subsubdynamicroute: subsubseries, subsubsubdynamicroute: subsubsubslug, lang } = await params;  
  switch (slug) {
    case 'drivers':
    case 'driver':
    case 'spareparts':
    case 'sparepart':
      return <ProductBySubSubCategoryPageJsonLd params={{ lang, driverCategory: slug, driversSubCategory: subslug, driversSeries: subsubseries, driversSubSubCategory: subsubsubslug }} />
    default:
      <></>
  }
}