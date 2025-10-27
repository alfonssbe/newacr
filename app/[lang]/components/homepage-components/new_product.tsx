"use client";

import { Products } from "@/app/types";
import { Loader } from "@/app/[lang]/components/ui/loader";
import { useEffect, useState } from "react";
import SwiperCarouselNewProduct from "@/app/[lang]/components/ui/swipercarouselnewproduct";
import getAllFeaturedProducts from "@/app/actions/get-all-featured-products";
import { useTranslations } from "next-intl";

const NewProduct: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<Products[]>([]);
  const t = useTranslations('New Product Home');

  useEffect(() => {
    async function fetchData() {
      try {
        const featuredData: Products[] = await getAllFeaturedProducts();
        setValue(featuredData);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-background">
      {loading ? (
        <div className="flex items-center justify-center w-screen h-[300px] z-50">
          <Loader />
        </div>
      ) : (
        <>
          <div className="container mx-auto xl:px-24 xl:pb-8 lg:px-16 lg:pb-6 px-10 pb-4 pt-4 h-fit">
            <h2 className="sr-only">{t('h2 title')}</h2>
              <SwiperCarouselNewProduct featured={value}/>
          </div>
        </>
      )}
    </div>
  );
};

export default NewProduct;
