import { MetadataRoute } from "next";
import "dotenv/config"; // Load .env.local variables
import { writeFile } from "fs/promises";
import path from "path";

// Fetch your dynamic URLs (from a database, API, or local data)
async function getProductsDynamicUrls() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS}`);
  const products = await res.json();
  const idUrls = products.map((product: { slug: string }) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/produk/${product.slug}`,
    lastModified: new Date().toISOString(),
    alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/produk/${product.slug}`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/products/${product.slug}`,
        },
      },
  }));
  
  const enUrls = products.map((product: { slug: string }) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/products/${product.slug}`,
    lastModified: new Date().toISOString(),
    alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/produk/${product.slug}`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/products/${product.slug}`,
        },
      },
  }));
   
  return [idUrls, enUrls];
}

// Fetch your dynamic URLs (from a database, API, or local data)
async function getSparepartsDynamicUrls() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_SPAREPARTS}`);
  const products = await res.json();
  const idUrls = products.map((product: { slug: string }) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/produk/${product.slug}`,
    lastModified: new Date().toISOString(),
    alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/produk/${product.slug}`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/products/${product.slug}`,
        },
      },
  }));
  
  const enUrls = products.map((product: { slug: string }) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/products/${product.slug}`,
    lastModified: new Date().toISOString(),
    alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/produk/${product.slug}`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/products/${product.slug}`,
        },
      },
  }));
   
  return [idUrls, enUrls];
}

// Fetch your dynamic URLs (from a database, API, or local data)
async function getNewsDynamicUrls() {
  const API_EDITED = process.env.NEXT_PUBLIC_FETCH_ALL_NEWS!.replace('{totalNews}', "all");

  const res = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/${API_EDITED}`);
  const news = await res.json();

  const idUrls = news.map((onenews: { slug: string }) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/berita/${onenews.slug}`,
    lastModified: new Date().toISOString(),
    alternates: {
      languages: {
        id: `${process.env.NEXT_PUBLIC_ROOT_URL}/berita/${onenews.slug}`,
        en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/news/${onenews.slug}`,
      },
    },
  }));

  const enUrls = news.map((onenews: { slug_english: string }) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/news/${onenews.slug_english}`,
    lastModified: new Date().toISOString(),
    alternates: {
      languages: {
        id: `${process.env.NEXT_PUBLIC_ROOT_URL}/berita/${onenews.slug_english}`,
        en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/news/${onenews.slug_english}`,
      },
    },
  }));

  return [idUrls, enUrls];
}

// Generate the sitemap dynamically
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productsDynamicUrlsID, productsDynamicUrlsEN] = await getProductsDynamicUrls();
  const [sparepartsDynamicUrlsID, sparepartsDynamicUrlsEN] = await getSparepartsDynamicUrls();
  const [newsDynamicUrlsID, newsDynamicUrlsEN]= await getNewsDynamicUrls();


  // Static URLs
  const staticUrlsID = [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/kontak`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/kontak`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/contact`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/distributor`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/distributor`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/distributors`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/katalog`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/katalog`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/catalogues`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/tentang-kami`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/tentang-kami`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/about-us`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/berita`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/berita`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/news`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/discontinued`,
        },
      },
    },




    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/discontinued`,
        },
      },
    },



  ];

   const staticUrlsEN = [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/contact`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/kontak`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/contact`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/distributors`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/distributor`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/distributors`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/catalogues`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/katalog`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/catalogues`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/about-us`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/tentang-kami`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/about-us`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/news`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/berita`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/news`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/desibel/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/desibel/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/curve/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/curve/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/premier/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/premier/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/deluxe/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/deluxe/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/excellent/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/excellent/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/fabulous/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/fabulous/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/driver/acr/pro/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/drivers/acr/pro/discontinued`,
        },
      },
    },




    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/desibel/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/desibel/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/curve/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/curve/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/subwoofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/subwoofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/subwoofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/premier/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/premier/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/deluxe/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/deluxe/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/woofer`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/woofer`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/woofer`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/full-range`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/full-range`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/full-range`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/midrange`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/midrange`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/midrange`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/excellent/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/excellent/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/tweeter`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/tweeter`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/tweeter`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/fabulous/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/fabulous/discontinued`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/discontinued`,
      lastModified: new Date().toISOString(),
      alternates: {
        languages: {
          id: `${process.env.NEXT_PUBLIC_ROOT_URL}/sparepart/acr/pro/discontinued`,
          en: `${process.env.NEXT_PUBLIC_ROOT_URL}/en/spareparts/acr/pro/discontinued`,
        },
      },
    },

  ];

  return [
  //@ts-ignore
  [...staticUrlsID, ...productsDynamicUrlsID, ...sparepartsDynamicUrlsID, ...newsDynamicUrlsID],
  //@ts-ignore
  [...staticUrlsEN, ...productsDynamicUrlsEN, ...sparepartsDynamicUrlsEN , ...newsDynamicUrlsEN],
];
}



sitemap()
  .then(async (data) => {
    // Convert the sitemap array to XML format
    for (let i = 0; i < 2; i++) { 
    const xmlContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${((Array.isArray(data[i]) ? data[i] : [data[i]]) as any[]).map((url: any) => 
          `          <url>
            <loc>${url.url}</loc>
            <lastmod>${url.lastModified}</lastmod>
          </url>`
          )
          .join("\n")}
      </urlset>
    `.trim();

    // Define the path where to save the sitemap
    const filePath = path.join(process.cwd(), "public", `${i===0?"sitemap-id.xml":"sitemap-en.xml"}`);

    // Write to sitemap.xml file
    await writeFile(filePath, xmlContent, "utf8");
    console.log(`Sitemap saved to ${filePath}`);
    }

    // const xmlContent = `
    //   <?xml version="1.0" encoding="UTF-8"?>
    //   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    //       <url>
    //         <loc>${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap-id.xml</loc>
    //         <lastmod>${new Date().toISOString()}</lastmod>
    //       </url>
    //       <url>
    //         <loc>${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap-en.xml</loc>
    //         <lastmod>${new Date().toISOString()}</lastmod>
    //       </url>
    //   </urlset>
    // `.trim();

    const xmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap-id.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap-en.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    </sitemapindex>
    `.trim();


    // Define the path where to save the sitemap
    const filePath = path.join(process.cwd(), "public", "sitemap.xml");

    // Write to sitemap.xml file
    await writeFile(filePath, xmlContent, "utf8");
    console.log(`Sitemap saved to ${filePath}`);
  })
  .catch(console.error);