import AboutUs from '../components/all-pages/about-us';
import Catalog from '../components/all-pages/catalog';
import ContactUsJsonLd from '../components/all-pages/contact';
import ComparisonPage from '../components/all-pages/comparison';
import Distributors from '../components/all-pages/distributors';
import NewsJsonLd from '../components/all-pages/all-news/news';
import SparepartByCategoryPageJsonLd from '../components/all-pages/all-spareparts/spareparts';
import ProductByCategoryPageJsonLd from '../components/all-pages/all-drivers/drivers';

export default async function RoutePage({
  params,
}: {
  params: Promise<{ dynamicroute: string; lang: string }>;
}) {
  const { dynamicroute: slug, lang } = await params;

  switch (slug) {
    case 'about':
    case 'about-us':
    case 'tentang-kami':
      return <AboutUs params={{ lang }} />;
    case 'catalog':
    case 'katalog':
      return <Catalog params={{ lang }} />;
    case 'contact':
    case 'kontak':
      return <ContactUsJsonLd params={{ lang }} />;
    case 'comparison':
    case 'komparasi':
      return <ComparisonPage />;
    case 'distributors':
    case 'distributor':
      return <Distributors params={{ lang }} />;
    case 'news':
    case 'berita':
      return <NewsJsonLd params={{ lang }} />;
    case 'drivers':
    case 'driver':
      return <ProductByCategoryPageJsonLd params={{ lang }} />;
    case 'spareparts':
    case 'sparepart':
      return <SparepartByCategoryPageJsonLd params={{ lang }} />;
    default:
      <></>;
  }
}