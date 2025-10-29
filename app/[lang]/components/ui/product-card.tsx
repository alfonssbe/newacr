import Link from "next/link";
import { AllProductsJsonType } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { LazyImageCustom } from "../lazyImageCustom";
import { allCardProduct } from "@/app/utils/filterPageProps";

interface ReviewCard {
  data: AllProductsJsonType
  isSparepart: boolean
}

const ProductCard: React.FC<ReviewCard> = ({
  data, isSparepart
}) => {
  const t = useTranslations('New Product Home');
  const locale = useLocale()
  return ( 
    <div className="bg-secondary rounded-xl">
      <div className="px-4 pt-4">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full flex items-center justify-center pb-4">
            <LazyImageCustom
              src={`/images/acr/series_logo/${
                data && data.allCat.length!=0 && 
                  data.allCat.find((val) => val.type === 'Series')?.name === "Black" ? 
                    "acr_white_bg.webp"
                  :  
                  data.allCat.find((val) => val.type === 'Series')?.name === "Black Magic" ?
                    "acr_white_bg.webp"
                  :  
                  data.allCat.find((val) => val.type === 'Series')?.name === "Premier" ?
                    "premier_white_bg.webp"
                  :
                  data.allCat.find((val) => val.type === 'Series')?.name === "Excellent" ?
                    "excellent_white_bg.webp"
                  :
                  data.allCat.find((val) => val.type === 'Series')?.name === "Deluxe" ?
                    "deluxe_white_bg.webp"
                  :
                  data.allCat.find((val) => val.type === 'Series')?.name === "Classic" ?
                    "acr_white_bg.webp"
                  :
                  data.allCat.find((val) => val.type === 'Series')?.name === "Fabulous" ?
                    "fabulous_white_bg.webp"
                  :
                  data.allCat.find((val) => val.type === 'Series')?.name === "Pro" ?
                    "acr_white_bg.webp"
                :
                data.allCat.find((val) => val.type === 'Sub Category' && val.name === 'Curve') ?
                    "curve_white_bg.webp"
                :
                data.allCat.find((val) => val.type === 'Sub Category' && val.name === 'Desibel') ?
                    "desibel_white_bg.webp"
                :
                    "acr_white_bg.webp"

              }`} 
              alt={'Logo Series'} 
              width={500}
              height={500}
              classname="max-h-[20px] min-h-[8px] w-auto object-contain"
              lazy={false}
            />
          </div>
        </div>
        <h3 className="text-lg lg:text-3xl font-bold text-center text-black line-clamp-1">{data.name}</h3>
        <h4 className="text-sm text-black lg:text-base text-center font-light line-clamp-1">
          {(() => {
            const subSub = data.allCat.find((val) => val.type === 'Sub Sub Category')?.name || '';
            const series = data.allCat.find((val) => val.type === 'Series')?.name || '';

            // Build the parts
            const subSubPart = subSub;
            const seriesPart = series ? `${series} Series` : '';

            // Combine with a dash only if both exist
            if (subSubPart && seriesPart) return `${subSubPart} - ${seriesPart}`;
            if (subSubPart) return subSubPart;
            if (seriesPart) return seriesPart;
            return '';
          })()}
        </h4>
        <div className={`${data.spec.length > 0 ? 'grid grid-cols-2' : 'grid grid-cols-1'} w-full py-4 gap-2`}>
          <div className="min-h-[185px] flex items-center h-auto">
            <LazyImageCustom
              src={data.cover_img.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.cover_img.url}` : data.cover_img.url} 
              alt={data.name} 
              width={500}
              height={500}
              classname="max-h-[160px] w-auto"
              lazy={false}
            />
          </div>   
          {data.spec.length > 0 &&
            <div className="w-full min-h-[185px] bg-transparent rounded-md p-2">
              {data.spec.map((oneSpec, index) => 
                <div className="text-sm text-black lg:text-base font-light pt-2" key={index}>
                  <h4 className=" line-clamp-1">
                    {locale === 'en' ? oneSpec.childnameEnglish : oneSpec.childnameIndo}
                  </h4>
                  {oneSpec.value != "-" && oneSpec.value != "" ? 
                    <h5 className="font-semibold line-clamp-1">
                      {oneSpec.value} {oneSpec.unit}
                    </h5>
                  :
                    <>-</>
                  } 
                </div>
              )}
            </div>
          }
        </div>
      
    </div>  

  {isSparepart ? 
      <div className="grid grid-cols-1">

      <Link href={{
        pathname: locale === 'id' ? `/produk/${data?.slug}` : `/${locale}/products/${data?.slug}`,
      }} >
        <div className="pt-2">
          <Button className="w-full rounded-none rounded-bl-xl rounded-br-xl" variant="default" size="default">{t('tombol-spesifikasi')}</Button>
        </div>
      </Link>

      </div>
      :
          <div className="grid grid-cols-2">
      <Link
        href={{
          pathname: locale === 'id' ? '/komparasi' : `/${locale}/comparison`,
          query: { product1slug: data?.slug },
        }}
      >
        <div className="pt-2">
          <Button className="w-full rounded-none rounded-bl-xl border border-foreground text-primary" variant="ghost" size="default">{t('tombol-perbandingan')}</Button>
        </div>
      </Link>

      <Link href={{
        pathname: locale === 'id' ? `/produk/${data?.slug}` : `/${locale}/products/${data?.slug}`,
      }} >
        <div className="pt-2">
          <Button className="w-full rounded-none rounded-br-xl" variant="default" size="default">{t('tombol-spesifikasi')}</Button>
        </div>
      </Link>

      </div>
    }

    </div>
  );
}

export default ProductCard;
