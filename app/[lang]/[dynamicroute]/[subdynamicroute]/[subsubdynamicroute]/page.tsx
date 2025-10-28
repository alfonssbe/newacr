import NotFound from "@/app/not-found";
import ProductBySeriesPageJsonLd from "@/app/[lang]/components/all-pages/all-drivers/subDrivers/seriesDrivers/seriesDrivers";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ dynamicroute: string; subdynamicroute: string; subsubdynamicroute: string; lang: string }>;
}) {
  const { dynamicroute: slug, subdynamicroute: subslug, subsubdynamicroute: subsubseries, lang } = await params;  
  switch (slug) {
    case 'drivers':
    case 'driver':
    case 'spareparts':
    case 'sparepart':
      return <ProductBySeriesPageJsonLd params={{ lang, driverCategory: slug, driversSubCategory: subslug, driversSeries: subsubseries }} />
    default:
      <></>
  }
}