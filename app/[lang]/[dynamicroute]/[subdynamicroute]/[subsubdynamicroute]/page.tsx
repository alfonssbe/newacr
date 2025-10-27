import NotFound from "@/app/not-found";
import ProductBySeriesPageJsonLd from "@/app/[lang]/components/all-pages/all-drivers/subDrivers/seriesDrivers/seriesDrivers";
import SparepartBySeriesPageJsonLd from "@/app/[lang]/components/all-pages/all-spareparts/subSpareparts/seriesSpareparts/seriesSpareparts";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ dynamicroute: string; subdynamicroute: string; subsubdynamicroute: string; lang: string }>;
}) {
  const { dynamicroute: slug, subdynamicroute: subslug, subsubdynamicroute: subsubseries, lang } = await params;  
  switch (slug) {
    case 'drivers':
    case 'driver':
      return <ProductBySeriesPageJsonLd params={{ lang, driversSubCategory: subslug, driversSeries: subsubseries }} />;
    case 'spareparts':
    case 'sparepart':
      return <SparepartBySeriesPageJsonLd params={{ lang, sparepartSubCategory: subslug, sparepartSeries: subsubseries }} />;
    default:
      <></>
  }
}