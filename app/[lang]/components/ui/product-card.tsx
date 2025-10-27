import Link from "next/link";
import { Products } from "@/app/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { LazyImageCustom } from "../lazyImageCustom";

interface ReviewCard {
  data: Products
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
                data.series.length!=0 ? 
                  data.series[0].name === "Black" ? 
                    "acr_white_bg.webp"
                  :  
                  data.series[0].name === "Black Magic" ?
                    "acr_white_bg.webp"
                  :  
                  data.series[0].name === "Premier" ?
                    "premier_white_bg.webp"
                  :
                  data.series[0].name === "Excellent" ?
                    "excellent_white_bg.webp"
                  :
                  data.series[0].name === "Deluxe" ?
                    "deluxe_white_bg.webp"
                  :
                  data.series[0].name === "Classic" ?
                    "acr_white_bg.webp"
                  :
                  data.series[0].name === "Fabulous" ?
                    "fabulous_white_bg.webp"
                  :
                  data.series[0].name === "Pro" ?
                    "acr_white_bg.webp"
                  :
                    "acr_white_bg.webp"
                :
                data.sub_categories.find((subcat) =>  subcat.name === "Curve") ?
                    "curve_white_bg.webp"
                :
                data.sub_categories.find((subcat) =>  subcat.name === "Desibel") ?
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
        <h4 className="text-sm text-black lg:text-base text-center font-light line-clamp-1">{data.size.label != '-' && data.size.value.toString().concat(" inch ")}{data.sub_sub_categories.length > 0 && data.sub_sub_categories[0].name}{data.series.length>0 && " - ".concat(data.series[0].name, " Series")}</h4>
      {isSparepart ? 
        <div className="grid grid-cols-1 w-full py-4 gap-2">
          <div className="flex items-center h-auto">
            <LazyImageCustom
              src={data.coverUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.coverUrl}` : data.coverUrl} 
              alt={data.name} 
              width={500}
              height={500}
              classname="max-h-[160px] w-auto"
              lazy={false}
            />
          </div>   
          {/* <div className="w-full min-h-[160px] bg-transparent rounded-md p-2">
            <div className="text-sm text-black lg:text-base font-light pt-2"><h4 className=" line-clamp-1">{t('sensitivity-spec')}</h4><h5 className="font-semibold">{data.specification.spl && data.specification.spl != "" ? data.specification.spl.concat(" dB") : "-"}</h5></div>
            <div className="text-sm text-black lg:text-base font-light pt-2"><h4 className=" line-clamp-1">{t('impedansi-spec')}</h4><h5 className="font-semibold">{data.specification.impedansi && data.specification.impedansi != "" ? data.specification.impedansi.concat(" Ω") : "-"}</h5></div>
            <div className="text-sm text-black lg:text-base font-light pt-2"><h4 className=" line-clamp-1">{t('program-power-spec')}</h4><h5 className="font-semibold">{data.specification.program_power && data.specification.program_power != "" ? data.specification.program_power.concat(" W") : "-"}</h5></div>
          </div> */}
        </div>
        :
        <div className="grid grid-cols-2 w-full py-4 gap-2">
          <div className="flex items-center h-auto">
            <LazyImageCustom
              src={data.coverUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.coverUrl}` : data.coverUrl} 
              alt={data.name} 
              width={500}
              height={500}
              classname="max-h-[160px] w-auto"
              lazy={false}
            />
          </div>   
          <div className="w-full min-h-[160px] bg-transparent rounded-md p-2">
            <div className="text-sm text-black lg:text-base font-light pt-2"><h4 className=" line-clamp-1">{t('sensitivity-spec')}</h4><h5 className="font-semibold">{data.specification.spl && data.specification.spl != "" ? data.specification.spl.concat(" dB") : "-"}</h5></div>
            <div className="text-sm text-black lg:text-base font-light pt-2"><h4 className=" line-clamp-1">{t('impedansi-spec')}</h4><h5 className="font-semibold">{data.specification.impedansi && data.specification.impedansi != "" ? data.specification.impedansi.concat(" Ω") : "-"}</h5></div>
            <div className="text-sm text-black lg:text-base font-light pt-2"><h4 className=" line-clamp-1">{t('program-power-spec')}</h4><h5 className="font-semibold">{data.specification.program_power && data.specification.program_power != "" ? data.specification.program_power.concat(" W") : "-"}</h5></div>
          </div>
        </div>
      }
      
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
