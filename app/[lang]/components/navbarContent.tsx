"use client"

import { NavigationMenuContent, NavigationMenuLink } from "./ui/navigation-menu";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { ChildSpecificationProp, NavbarComponents, NavbarFeaturedProduct, NavbarProducts } from "@/app/types";
import getAllNavbarContent from "@/app/actions/get-all-navbar-content";
import getProductsForNavbar from "@/app/actions/get-product-for-navbar";
import { Loader } from './ui/loader';
import { useLocale, useTranslations } from "next-intl";
import { LazyImageCustom } from "./lazyImageCustom";
import { Button } from "@/components/ui/button";

//SUB MENU
const AllDriversSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Series",
    href: "/drivers/acr/pro",
    parent: ["ACR"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro",
    haveSparepart: false
  },
  {
    title: "ACR Black Series",
    href: "/drivers/acr/black",
    parent: ["ACR"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Series",
    href: "/drivers/acr/black-magic",
    parent: ["ACR"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Series",
    href: "/drivers/acr/fabulous",
    parent: ["ACR"],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Series",
    href: "/drivers/acr/excellent",
    parent: ["ACR"],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Series",
    href: "/drivers/acr/deluxe",
    parent: ["ACR"],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series",
    haveSparepart: false
  },
  {
    title: "ACR Classic Series",
    href: "/drivers/acr/classic",
    parent: ["ACR"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series",
    haveSparepart: false
  },
  {
    title: "Curve None Series",
    href: "/drivers/curve",
    parent: ["Curve"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series",
    haveSparepart: false
  },
  {
    title: "ACR Premier Series",
    href: "/drivers/acr/premier",
    parent: ["ACR"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series",
    haveSparepart: false
  },
  {
    title: "Desibel None Series",
    href: "/drivers/desibel",
    parent: ["Desibel"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series",
    haveSparepart: false
  },
]

const SubwooferSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Series Subwoofer",
    href: "/drivers/acr/pro/subwoofer",
    parent: ["ACR", 'Pro', "Subwoofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro-subwoofer",
    haveSparepart: false
  },
  {
    title: "ACR Black Series Subwoofer",
    href: "/drivers/acr/black/subwoofer",
    parent: ["ACR", "Black", "Subwoofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series-subwoofer",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Series Subwoofer",
    href: "/drivers/acr/black-magic/subwoofer",
    parent: ["ACR", 'Black Magic', "Subwoofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series-subwoofer",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Series Subwoofer",
    href: "/drivers/acr/fabulous/subwoofer",
    parent: ["ACR", 'Fabulous', "Subwoofer"],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series-subwoofer",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Series Subwoofer",
    href: "/drivers/acr/excellent/subwoofer",
    parent: ["ACR", 'Excellent', "Subwoofer"],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series-subwoofer",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Series Subwoofer",
    href: "/drivers/acr/deluxe/subwoofer",
    parent: ["ACR", 'Deluxe', "Subwoofer"],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series-subwoofer",
    haveSparepart: false
  },
  {
    title: "ACR Classic Series Subwoofer",
    href: "/drivers/acr/classic/subwoofer",
    parent: ["ACR", "Classic", "Subwoofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series-subwoofer",
    haveSparepart: false
  },
  {
    title: "Curve None Series Subwoofer",
    href: "/drivers/curve/subwoofer",
    parent: ["Curve", "Subwoofer"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series-subwoofer",
    haveSparepart: false
  },
  {
    title: "ACR Premier Series Subwoofer",
    href: "/drivers/acr/premier/subwoofer",
    parent: ["ACR", "Premier", "Subwoofer"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series-subwoofer",
    haveSparepart: false
  },
  {
    title: "Desibel None Series Subwoofer",
    href: "/drivers/desibel/subwoofer",
    parent: ["Desibel", "Subwoofer"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series-subwoofer",
    haveSparepart: false
  },
]

const WooferSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Series Woofer",
    href: "/drivers/acr/pro/woofer",
    parent: ["ACR", 'Pro', "Woofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro-woofer",
    haveSparepart: false
  },
  {
    title: "ACR Black Series Woofer",
    href: "/drivers/acr/black/woofer",
    parent: ["ACR", "Black", "Woofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series-woofer",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Series Woofer",
    href: "/drivers/acr/black-magic/woofer",
    parent: ["ACR", 'Black Magic', "Woofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series-woofer",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Series Woofer",
    href: "/drivers/acr/fabulous/woofer",
    parent: ["ACR", 'Fabulous', "Woofer"],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series-woofer",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Series Woofer",
    href: "/drivers/acr/excellent/woofer",
    parent: ["ACR", 'Excellent', "Woofer"],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series-woofer",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Series Woofer",
    href: "/drivers/acr/deluxe/woofer",
    parent: ["ACR", 'Deluxe', "Woofer"],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series-woofer",
    haveSparepart: false
  },
  {
    title: "ACR Classic Series Woofer",
    href: "/drivers/acr/classic/woofer",
    parent: ["ACR", "Classic", "Woofer"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series-woofer",
    haveSparepart: false
  },
  {
    title: "Curve None Series Woofer",
    href: "/drivers/curve/woofer",
    parent: ["Curve", "Woofer"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series-woofer",
    haveSparepart: false
  },
  {
    title: "ACR Premier Series Woofer",
    href: "/drivers/acr/premier/woofer",
    parent: ["ACR", "Premier", "Woofer"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series-woofer",
    haveSparepart: false
  },
  {
    title: "Desibel None Series Woofer",
    href: "/drivers/desibel/woofer",
    parent: ["Desibel", "Woofer"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series-woofer",
    haveSparepart: false
  },
]

const FullrangeSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Series Fullrange",
    href: "/drivers/acr/pro/full-range",
    parent: ["ACR", 'Pro', "Fullrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro-fullrange",
    haveSparepart: false
  },
  {
    title: "ACR Black Series Fullrange",
    href: "/drivers/acr/black/full-range",
    parent: ["ACR", "Black", "Fullrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series-fullrange",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Series Fullrange",
    href: "/drivers/acr/black-magic/full-range",
    parent: ["ACR", 'Black Magic', "Fullrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series-fullrange",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Series Fullrange",
    href: "/drivers/acr/fabulous/full-range",
    parent: ["ACR", 'Fabulous', "Fullrange"],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series-fullrange",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Series Fullrange",
    href: "/drivers/acr/excellent/full-range",
    parent: ["ACR", 'Excellent', "Fullrange"],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series-fullrange",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Series Fullrange",
    href: "/drivers/acr/deluxe/full-range",
    parent: ["ACR", 'Deluxe', "Fullrange"],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series-fullrange",
    haveSparepart: false
  },
  {
    title: "ACR Classic Series Fullrange",
    href: "/drivers/acr/classic/full-range",
    parent: ["ACR", "Classic", "Fullrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series-fullrange",
    haveSparepart: false
  },
  {
    title: "Curve None Series Fullrange",
    href: "/drivers/curve/full-range",
    parent: ["Curve", "Fullrange"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series-fullrange",
    haveSparepart: false
  },
  {
    title: "ACR Premier Series Fullrange",
    href: "/drivers/acr/premier/full-range",
    parent: ["ACR", "Premier", "Fullrange"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series-fullrange",
    haveSparepart: false
  },
  {
    title: "Desibel None Series Fullrange",
    href: "/drivers/desibel/full-range",
    parent: ["Desibel", "Fullrange"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series-fullrange",
    haveSparepart: false
  },
]

const MidrangeSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Series Midrange",
    href: "/drivers/acr/pro/midrange",
    parent: ["ACR", 'Pro', "Midrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro-midrange",
    haveSparepart: false
  },
  {
    title: "ACR Black Series Midrange",
    href: "/drivers/acr/black/midrange",
    parent: ["ACR", "Black", "Midrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series-midrange",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Series Midrange",
    href: "/drivers/acr/black-magic/midrange",
    parent: ["ACR", 'Black Magic', "Midrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series-midrange",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Series Midrange",
    href: "/drivers/acr/fabulous/midrange",
    parent: ["ACR", 'Fabulous', "Midrange"],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series-midrange",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Series Midrange",
    href: "/drivers/acr/excellent/midrange",
    parent: ["ACR", 'Excellent', "Midrange"],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series-midrange",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Series Midrange",
    href: "/drivers/acr/deluxe/midrange",
    parent: ["ACR", 'Deluxe', "Midrange"],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series-midrange",
    haveSparepart: false
  },
  {
    title: "ACR Classic Series Midrange",
    href: "/drivers/acr/classic/midrange",
    parent: ["ACR", "Classic", "Midrange"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series-midrange",
    haveSparepart: false
  },
  {
    title: "Curve None Series Midrange",
    href: "/drivers/curve/midrange",
    parent: ["Curve", "Midrange"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series-midrange",
    haveSparepart: false
  },
  {
    title: "ACR Premier Series Midrange",
    href: "/drivers/acr/premier/midrange",
    parent: ["ACR", "Premier", "Midrange"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series-midrange",
    haveSparepart: false
  },
  {
    title: "Desibel None Series Midrange",
    href: "/drivers/desibel/midrange",
    parent: ["Desibel", "Midrange"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series-midrange",
    haveSparepart: false
  },
]

const TweeterSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Series Tweeter",
    href: "/drivers/acr/pro/tweeter",
    parent: ["ACR", 'Pro', "Tweeter"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro-tweeter",
    haveSparepart: false
  },
  {
    title: "ACR Black Series Tweeter",
    href: "/drivers/acr/black/tweeter",
    parent: ["ACR", "Black", "Tweeter"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series-tweeter",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Series Tweeter",
    href: "/drivers/acr/black-magic/tweeter",
    parent: ["ACR", 'Black Magic', "Tweeter"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series-tweeter",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Series Tweeter",
    href: "/drivers/acr/fabulous/tweeter",
    parent: ["ACR", 'Fabulous', "Tweeter"],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series-tweeter",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Series Tweeter",
    href: "/drivers/acr/excellent/tweeter",
    parent: ["ACR", 'Excellent', "Tweeter"],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series-tweeter",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Series Tweeter",
    href: "/drivers/acr/deluxe/tweeter",
    parent: ["ACR", 'Deluxe', "Tweeter"],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series-tweeter",
    haveSparepart: false
  },
  {
    title: "ACR Classic Series Tweeter",
    href: "/drivers/acr/classic/tweeter",
    parent: ["ACR", "Classic", "Tweeter"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series-tweeter",
    haveSparepart: false
  },
  {
    title: "Curve None Series Tweeter",
    href: "/drivers/curve/tweeter",
    parent: ["Curve", "Tweeter"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series-tweeter",
    haveSparepart: false
  },
  {
    title: "ACR Premier Series Tweeter",
    href: "/drivers/acr/premier/tweeter",
    parent: ["ACR", "Premier", "Tweeter"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series-tweeter",
    haveSparepart: false
  },
  {
    title: "Desibel None Series Tweeter",
    href: "/drivers/desibel/tweeter",
    parent: ["Desibel", "Tweeter"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series-tweeter",
    haveSparepart: false
  },
]

const SparepartSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Spareparts Series",
    href: "/spareparts/acr/pro",
    parent: ["ACR", 'Pro'],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro-sparepart",
    haveSparepart: false
  },
  {
    title: "ACR Black Spareparts Series",
    href: "/spareparts/acr/black",
    parent: ["ACR", "Black"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series-sparepart",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Spareparts Series",
    href: "/spareparts/acr/black-magic",
    parent: ["ACR", 'Black Magic'],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series-sparepart",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Spareparts Series",
    href: "/spareparts/acr/fabulous",
    parent: ["ACR", 'Fabulous'],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series-sparepart",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Spareparts Series",
    href: "/spareparts/acr/excellent",
    parent: ["ACR", 'Excellent'],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series-sparepart",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Spareparts Series",
    href: "/spareparts/acr/deluxe",
    parent: ["ACR", 'Deluxe'],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series-sparepart",
    haveSparepart: false
  },
  {
    title: "ACR Classic Spareparts Series",
    href: "/spareparts/acr/classic",
    parent: ["ACR", "Classic"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series-sparepart",
    haveSparepart: false
  },
  {
    title: "Curve None Spareparts Series",
    href: "/spareparts/curve",
    parent: ["Curve"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series-sparepart",
    haveSparepart: false
  },
  {
    title: "ACR Premier Spareparts Series",
    href: "/spareparts/acr/premier",
    parent: ["ACR", "Premier"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series-sparepart",
    haveSparepart: false
  },
  {
    title: "Desibel None Spareparts Series",
    href: "/spareparts/desibel",
    parent: ["Desibel"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series-sparepart",
    haveSparepart: false
  },
]

const DiscontinuedSubMenu: NavbarComponents[] = [
  {
    title: "ACR Pro Series Discontinued",
    href: "/drivers/acr/pro/discontinued",
    parent: ["ACR", 'Pro', "Discontinued"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-pro-discontinued",
    haveSparepart: false
  },
  {
    title: "ACR Black Series Discontinued",
    href: "/drivers/acr/black/discontinued",
    parent: ["ACR", "Black", "Discontinued"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-series-discontinued",
    haveSparepart: false
  },
  {
    title: "ACR Black Magic Series Discontinued",
    href: "/drivers/acr/black-magic/discontinued",
    parent: ["ACR", 'Black Magic', "Discontinued"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-black-magic-series-discontinued",
    haveSparepart: false
  },
  {
    title: "ACR Fabulous Series Discontinued",
    href: "/drivers/acr/fabulous/discontinued",
    parent: ["ACR", 'Fabulous', "Discontinued"],
    url: "/images/acr/series_logo/fabulous_black_bg.webp",
    slug: "all-acr-fabulous-series-discontinued",
    haveSparepart: false
  },  
  {
    title: "ACR Excellent Series Discontinued",
    href: "/drivers/acr/excellent/discontinued",
    parent: ["ACR", 'Excellent', "Discontinued"],
    url: "/images/acr/series_logo/excellent_black_bg.webp",
    slug: "all-acr-excellent-series-discontinued",
    haveSparepart: false
  },
  {
    title: "ACR Deluxe Series Discontinued",
    href: "/drivers/acr/deluxe/discontinued",
    parent: ["ACR", 'Deluxe', "Discontinued"],
    url: "/images/acr/series_logo/deluxe_black_bg.webp",
    slug: "all-acr-deluxe-series-discontinued",
    haveSparepart: false
  },
  {
    title: "ACR Classic Series Discontinued",
    href: "/drivers/acr/classic/discontinued",
    parent: ["ACR", "Classic", "Discontinued"],
    url: "/images/acr/series_logo/acr_black_bg.webp",
    slug: "all-acr-classic-series-discontinued",
    haveSparepart: false
  },
  {
    title: "Curve None Series Discontinued",
    href: "/drivers/curve/discontinued",
    parent: ["Curve", "Discontinued"],
    url: "/images/acr/series_logo/curve_black_bg.webp",
    slug: "all-curve-no-series-discontinued",
    haveSparepart: false
  },
  {
    title: "ACR Premier Series Discontinued",
    href: "/drivers/acr/premier/discontinued",
    parent: ["ACR", "Premier", "Discontinued"],
    url: "/images/acr/series_logo/premier_black_bg.webp",
    slug: "all-acr-premier-series-discontinued",
    haveSparepart: false
  },
  {
    title: "Desibel None Series Discontinued",
    href: "/drivers/desibel/discontinued",
    parent: ["Desibel", "Discontinued"],
    url: "/images/acr/series_logo/desibel_black_bg.webp",
    slug: "all-desibel-no-series-discontinued",
    haveSparepart: false
  },
]

//EMPTY MENU
const EmptyMenu: NavbarComponents[] = [
  {
    title: "",
    href: "",
    parent: [""],
    url: "",
    slug: "",
    haveSparepart: false
  },
]

let tempACRProAll: NavbarComponents[] = []
let tempACRBlackAll: NavbarComponents[] = []
let tempACRBlackMagicAll: NavbarComponents[] = []
let tempACRFabulousAll: NavbarComponents[] = []
let tempACRExcellentAll: NavbarComponents[] = []
let tempACRDeluxeAll: NavbarComponents[] = []
let tempACRClassicAll: NavbarComponents[] = []
let tempCurveNoneAll: NavbarComponents[] = []
let tempACRPremierAll: NavbarComponents[] = []
let tempDesibelNoneAll: NavbarComponents[] = []

let tempACRProSubwoofer: NavbarComponents[] = []
let tempACRBlackSubwoofer: NavbarComponents[] = []
let tempACRBlackMagicSubwoofer: NavbarComponents[] = []
let tempACRFabulousSubwoofer: NavbarComponents[] = []
let tempACRExcellentSubwoofer: NavbarComponents[] = []
let tempACRDeluxeSubwoofer: NavbarComponents[] = []
let tempACRClassicSubwoofer: NavbarComponents[] = []
let tempCurveNoneSubwoofer: NavbarComponents[] = []
let tempACRPremierSubwoofer: NavbarComponents[] = []
let tempDesibelNoneSubwoofer: NavbarComponents[] = []

let tempACRProWoofer: NavbarComponents[] = []
let tempACRBlackWoofer: NavbarComponents[] = []
let tempACRBlackMagicWoofer: NavbarComponents[] = []
let tempACRFabulousWoofer: NavbarComponents[] = []
let tempACRExcellentWoofer: NavbarComponents[] = []
let tempACRDeluxeWoofer: NavbarComponents[] = []
let tempACRClassicWoofer: NavbarComponents[] = []
let tempCurveNoneWoofer: NavbarComponents[] = []
let tempACRPremierWoofer: NavbarComponents[] = []
let tempDesibelNoneWoofer: NavbarComponents[] = []

let tempACRProFullrange: NavbarComponents[] = []
let tempACRBlackFullrange: NavbarComponents[] = []
let tempACRBlackMagicFullrange: NavbarComponents[] = []
let tempACRFabulousFullrange: NavbarComponents[] = []
let tempACRExcellentFullrange: NavbarComponents[] = []
let tempACRDeluxeFullrange: NavbarComponents[] = []
let tempACRClassicFullrange: NavbarComponents[] = []
let tempCurveNoneFullrange: NavbarComponents[] = []
let tempACRPremierFullrange: NavbarComponents[] = []
let tempDesibelNoneFullrange: NavbarComponents[] = []

let tempACRProMidrange: NavbarComponents[] = []
let tempACRBlackMidrange: NavbarComponents[] = []
let tempACRBlackMagicMidrange: NavbarComponents[] = []
let tempACRFabulousMidrange: NavbarComponents[] = []
let tempACRExcellentMidrange: NavbarComponents[] = []
let tempACRDeluxeMidrange: NavbarComponents[] = []
let tempACRClassicMidrange: NavbarComponents[] = []
let tempCurveNoneMidrange: NavbarComponents[] = []
let tempACRPremierMidrange: NavbarComponents[] = []
let tempDesibelNoneMidrange: NavbarComponents[] = []

let tempACRProTweeter: NavbarComponents[] = []
let tempACRBlackTweeter: NavbarComponents[] = []
let tempACRBlackMagicTweeter: NavbarComponents[] = []
let tempACRFabulousTweeter: NavbarComponents[] = []
let tempACRExcellentTweeter: NavbarComponents[] = []
let tempACRDeluxeTweeter: NavbarComponents[] = []
let tempACRClassicTweeter: NavbarComponents[] = []
let tempCurveNoneTweeter: NavbarComponents[] = []
let tempACRPremierTweeter: NavbarComponents[] = []
let tempDesibelNoneTweeter: NavbarComponents[] = []

let tempACRProSparepart: NavbarComponents[] = []
let tempACRBlackSparepart: NavbarComponents[] = []
let tempACRBlackMagicSparepart: NavbarComponents[] = []
let tempACRFabulousSparepart: NavbarComponents[] = []
let tempACRExcellentSparepart: NavbarComponents[] = []
let tempACRDeluxeSparepart: NavbarComponents[] = []
let tempACRClassicSparepart: NavbarComponents[] = []
let tempCurveNoneSparepart: NavbarComponents[] = []
let tempACRPremierSparepart: NavbarComponents[] = []
let tempDesibelNoneSparepart: NavbarComponents[] = []

let tempACRProDiscontinued: NavbarComponents[] = []
let tempACRBlackDiscontinued: NavbarComponents[] = []
let tempACRBlackMagicDiscontinued: NavbarComponents[] = []
let tempACRFabulousDiscontinued: NavbarComponents[] = []
let tempACRExcellentDiscontinued: NavbarComponents[] = []
let tempACRDeluxeDiscontinued: NavbarComponents[] = []
let tempACRClassicDiscontinued: NavbarComponents[] = []
let tempCurveNoneDiscontinued: NavbarComponents[] = []
let tempACRPremierDiscontinued: NavbarComponents[] = []
let tempDesibelNoneDiscontinued: NavbarComponents[] = []


//CONDITIONS
  const ACRProAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Curve' },
    // { type: 'Sub Sub Category', name: '' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    // { type: 'Sub Sub Category', name: '' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneAllConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Desibel' },
    // { type: 'Sub Sub Category', name: '' },
    // { type: 'Series', name: '' },
  ];

  const ACRProSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Curve' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneSubwooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Desibel' },
    { type: 'Sub Sub Category', name: 'Subwoofer' },
    // { type: 'Series', name: '' },
  ];

  const ACRProWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Curve' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneWooferConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Desibel' },
    { type: 'Sub Sub Category', name: 'Woofer' },
    // { type: 'Series', name: '' },
  ];

  const ACRProFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Curve' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneFullrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Desibel' },
    { type: 'Sub Sub Category', name: 'Full Range' },
    // { type: 'Series', name: '' },
  ];

  const ACRProMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Curve' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneMidrangeConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Desibel' },
    { type: 'Sub Sub Category', name: 'Midrange' },
    // { type: 'Series', name: '' },
  ];

  const ACRProTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Curve' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneTweeterConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Desibel' },
    { type: 'Sub Sub Category', name: 'Tweeter' },
    // { type: 'Series', name: '' },
  ];

  const ACRProSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'Curve' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneSparepartConditions = [
    { type: 'Category', name: 'Spareparts' },
    { type: 'Sub Category', name: 'Desibel' },
    // { type: 'Series', name: '' },
  ];

  const ACRProDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Pro' },
  ];
  const ACRBlackDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Black' },
  ];
  const ACRBlackMagicDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Black Magic' },
  ];
  const ACRFabulousDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Fabulous' },
  ];
  const ACRExcellentDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Excellent' },
  ];
  const ACRDeluxeDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Deluxe' },
  ];
  const ACRClassicDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Classic' },
  ];
  const CurveNoneDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Curve' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    // { type: 'Series', name: '' },
  ];
  const ACRPremierDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'ACR' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    { type: 'Series', name: 'Premier' },
  ];
  const DesibelNoneDiscontinuedConditions = [
    { type: 'Category', name: 'Drivers' },
    { type: 'Sub Category', name: 'Desibel' },
    { type: 'Sub Sub Category', name: 'Discontinued' },
    // { type: 'Series', name: '' },
  ];





  
  
  const conditionsAndTemps = [
    { conditions: ACRProAllConditions, tempArray: tempACRProAll },
    { conditions: ACRBlackAllConditions, tempArray: tempACRBlackAll },
    { conditions: ACRBlackMagicAllConditions, tempArray: tempACRBlackMagicAll },
    { conditions: ACRFabulousAllConditions, tempArray: tempACRFabulousAll },
    { conditions: ACRExcellentAllConditions, tempArray: tempACRExcellentAll },
    { conditions: ACRDeluxeAllConditions, tempArray: tempACRDeluxeAll },
    { conditions: ACRClassicAllConditions, tempArray: tempACRClassicAll },
    { conditions: CurveNoneAllConditions, tempArray: tempCurveNoneAll },
    { conditions: ACRPremierAllConditions, tempArray: tempACRPremierAll },
    { conditions: DesibelNoneAllConditions, tempArray: tempDesibelNoneAll },
    
    { conditions: ACRProSubwooferConditions, tempArray: tempACRProSubwoofer },
    { conditions: ACRBlackSubwooferConditions, tempArray: tempACRBlackSubwoofer },
    { conditions: ACRBlackMagicSubwooferConditions, tempArray: tempACRBlackMagicSubwoofer },
    { conditions: ACRFabulousSubwooferConditions, tempArray: tempACRFabulousSubwoofer },
    { conditions: ACRExcellentSubwooferConditions, tempArray: tempACRExcellentSubwoofer },
    { conditions: ACRDeluxeSubwooferConditions, tempArray: tempACRDeluxeSubwoofer },
    { conditions: ACRClassicSubwooferConditions, tempArray: tempACRClassicSubwoofer },
    { conditions: CurveNoneSubwooferConditions, tempArray: tempCurveNoneSubwoofer },
    { conditions: ACRPremierSubwooferConditions, tempArray: tempACRPremierSubwoofer },
    { conditions: DesibelNoneSubwooferConditions, tempArray: tempDesibelNoneSubwoofer },
    
    { conditions: ACRProWooferConditions, tempArray: tempACRProWoofer },
    { conditions: ACRBlackWooferConditions, tempArray: tempACRBlackWoofer },
    { conditions: ACRBlackMagicWooferConditions, tempArray: tempACRBlackMagicWoofer },
    { conditions: ACRFabulousWooferConditions, tempArray: tempACRFabulousWoofer },
    { conditions: ACRExcellentWooferConditions, tempArray: tempACRExcellentWoofer },
    { conditions: ACRDeluxeWooferConditions, tempArray: tempACRDeluxeWoofer },
    { conditions: ACRClassicWooferConditions, tempArray: tempACRClassicWoofer },
    { conditions: CurveNoneWooferConditions, tempArray: tempCurveNoneWoofer },
    { conditions: ACRPremierWooferConditions, tempArray: tempACRPremierWoofer },
    { conditions: DesibelNoneWooferConditions, tempArray: tempDesibelNoneWoofer },
    
    { conditions: ACRProFullrangeConditions, tempArray: tempACRProFullrange },
    { conditions: ACRBlackFullrangeConditions, tempArray: tempACRBlackFullrange },
    { conditions: ACRBlackMagicFullrangeConditions, tempArray: tempACRBlackMagicFullrange },
    { conditions: ACRFabulousFullrangeConditions, tempArray: tempACRFabulousFullrange },
    { conditions: ACRExcellentFullrangeConditions, tempArray: tempACRExcellentFullrange },
    { conditions: ACRDeluxeFullrangeConditions, tempArray: tempACRDeluxeFullrange },
    { conditions: ACRClassicFullrangeConditions, tempArray: tempACRClassicFullrange },
    { conditions: CurveNoneFullrangeConditions, tempArray: tempCurveNoneFullrange },
    { conditions: ACRPremierFullrangeConditions, tempArray: tempACRPremierFullrange },
    { conditions: DesibelNoneFullrangeConditions, tempArray: tempDesibelNoneFullrange },
    
    { conditions: ACRProMidrangeConditions, tempArray: tempACRProMidrange },
    { conditions: ACRBlackMidrangeConditions, tempArray: tempACRBlackMidrange },
    { conditions: ACRBlackMagicMidrangeConditions, tempArray: tempACRBlackMagicMidrange },
    { conditions: ACRFabulousMidrangeConditions, tempArray: tempACRFabulousMidrange },
    { conditions: ACRExcellentMidrangeConditions, tempArray: tempACRExcellentMidrange },
    { conditions: ACRDeluxeMidrangeConditions, tempArray: tempACRDeluxeMidrange },
    { conditions: ACRClassicMidrangeConditions, tempArray: tempACRClassicMidrange },
    { conditions: CurveNoneMidrangeConditions, tempArray: tempCurveNoneMidrange },
    { conditions: ACRPremierMidrangeConditions, tempArray: tempACRPremierMidrange },
    { conditions: DesibelNoneMidrangeConditions, tempArray: tempDesibelNoneMidrange },
    
    { conditions: ACRProTweeterConditions, tempArray: tempACRProTweeter },
    { conditions: ACRBlackTweeterConditions, tempArray: tempACRBlackTweeter },
    { conditions: ACRBlackMagicTweeterConditions, tempArray: tempACRBlackMagicTweeter },
    { conditions: ACRFabulousTweeterConditions, tempArray: tempACRFabulousTweeter },
    { conditions: ACRExcellentTweeterConditions, tempArray: tempACRExcellentTweeter },
    { conditions: ACRDeluxeTweeterConditions, tempArray: tempACRDeluxeTweeter },
    { conditions: ACRClassicTweeterConditions, tempArray: tempACRClassicTweeter },
    { conditions: CurveNoneTweeterConditions, tempArray: tempCurveNoneTweeter },
    { conditions: ACRPremierTweeterConditions, tempArray: tempACRPremierTweeter },
    { conditions: DesibelNoneTweeterConditions, tempArray: tempDesibelNoneTweeter },
        
    { conditions: ACRProSparepartConditions, tempArray: tempACRProSparepart },
    { conditions: ACRBlackSparepartConditions, tempArray: tempACRBlackSparepart },
    { conditions: ACRBlackMagicSparepartConditions, tempArray: tempACRBlackMagicSparepart },
    { conditions: ACRFabulousSparepartConditions, tempArray: tempACRFabulousSparepart },
    { conditions: ACRExcellentSparepartConditions, tempArray: tempACRExcellentSparepart },
    { conditions: ACRDeluxeSparepartConditions, tempArray: tempACRDeluxeSparepart },
    { conditions: ACRClassicSparepartConditions, tempArray: tempACRClassicSparepart },
    { conditions: CurveNoneSparepartConditions, tempArray: tempCurveNoneSparepart },
    { conditions: ACRPremierSparepartConditions, tempArray: tempACRPremierSparepart },
    { conditions: DesibelNoneSparepartConditions, tempArray: tempDesibelNoneSparepart },
    
    { conditions: ACRProDiscontinuedConditions, tempArray: tempACRProDiscontinued },
    { conditions: ACRBlackDiscontinuedConditions, tempArray: tempACRBlackDiscontinued },
    { conditions: ACRBlackMagicDiscontinuedConditions, tempArray: tempACRBlackMagicDiscontinued },
    { conditions: ACRFabulousDiscontinuedConditions, tempArray: tempACRFabulousDiscontinued },
    { conditions: ACRExcellentDiscontinuedConditions, tempArray: tempACRExcellentDiscontinued },
    { conditions: ACRDeluxeDiscontinuedConditions, tempArray: tempACRDeluxeDiscontinued },
    { conditions: ACRClassicDiscontinuedConditions, tempArray: tempACRClassicDiscontinued },
    { conditions: CurveNoneDiscontinuedConditions, tempArray: tempCurveNoneDiscontinued },
    { conditions: ACRPremierDiscontinuedConditions, tempArray: tempACRPremierDiscontinued },
    { conditions: DesibelNoneDiscontinuedConditions, tempArray: tempDesibelNoneDiscontinued },


];

function NavbarContent (){
    const t = useTranslations('Navbar Content');
    const [driversubMenu, setDriversSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
    const [driversubsubMenu, setDriversSubSubMenu] = useState<NavbarComponents[][]>([EmptyMenu]);
    const [FeaturedProduct, setFeaturedProduct] = useState<NavbarFeaturedProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const locale = useLocale()
    const [loadingSubSubMenu, setLoadingSubSubMenu] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    // const inputRef = useRef<HTMLInputElement>(null);
  
    //ACR
    const [ACRProAllSubSubMenu, setACRProAllSubSubMenu] = useState<NavbarComponents[]>(tempACRProAll)
    const [ACRBlackAllSubSubMenu, setACRBlackAllSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackAll)
    const [ACRBlackMagicAllSubSubMenu, setACRBlackMagicAllSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicAll)
    const [ACRFabulousAllSubSubMenu, setACRFabulousAllSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousAll)
    const [ACRExcellentAllSubSubMenu, setACRExcellentAllSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentAll)
    const [ACRDeluxeAllSubSubMenu, setACRDeluxeAllSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeAll)
    const [ACRClassicAllSubSubMenu, setACRClassicAllSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicAll)
    const [CurveNoneAllSubSubMenu, setCurveNoneAllSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneAll)
    const [ACRPremierAllubSubMenu, setACRPremierAllubSubMenu] = useState<NavbarComponents[]>(tempACRPremierAll)
    const [DesibelNoneAllSubSubMenu, setDesibelNoneAllSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneAll)
    
    const [ACRProSubwooferSubSubMenu, setACRProSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempACRProSubwoofer)
    const [ACRBlackSubwooferSubSubMenu, setACRBlackSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackSubwoofer)
    const [ACRBlackMagicSubwooferSubSubMenu, setACRBlackMagicSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicSubwoofer)
    const [ACRFabulousSubwooferSubSubMenu, setACRFabulousSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousSubwoofer)
    const [ACRExcellentSubwooferSubSubMenu, setACRExcellentSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentSubwoofer)
    const [ACRDeluxeSubwooferSubSubMenu, setACRDeluxeSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeSubwoofer)
    const [ACRClassicSubwooferSubSubMenu, setACRClassicSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicSubwoofer)
    const [CurveNoneSubwooferSubSubMenu, setCurveNoneSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneSubwoofer)
    const [ACRPremierSubwooferubSubMenu, setACRPremierSubwooferubSubMenu] = useState<NavbarComponents[]>(tempACRPremierSubwoofer)
    const [DesibelNoneSubwooferSubSubMenu, setDesibelNoneSubwooferSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneSubwoofer)
    
    const [ACRProWooferSubSubMenu, setACRProWooferSubSubMenu] = useState<NavbarComponents[]>(tempACRProWoofer)
    const [ACRBlackWooferSubSubMenu, setACRBlackWooferSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackWoofer)
    const [ACRBlackMagicWooferSubSubMenu, setACRBlackMagicWooferSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicWoofer)
    const [ACRFabulousWooferSubSubMenu, setACRFabulousWooferSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousWoofer)
    const [ACRExcellentWooferSubSubMenu, setACRExcellentWooferSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentWoofer)
    const [ACRDeluxeWooferSubSubMenu, setACRDeluxeWooferSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeWoofer)
    const [ACRClassicWooferSubSubMenu, setACRClassicWooferSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicWoofer)
    const [CurveNoneWooferSubSubMenu, setCurveNoneWooferSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneWoofer)
    const [ACRPremierWooferubSubMenu, setACRPremierWooferubSubMenu] = useState<NavbarComponents[]>(tempACRPremierWoofer)
    const [DesibelNoneWooferSubSubMenu, setDesibelNoneWooferSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneWoofer)

    const [ACRProFullrangeSubSubMenu, setACRProFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRProFullrange)
    const [ACRBlackFullrangeSubSubMenu, setACRBlackFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackFullrange)
    const [ACRBlackMagicFullrangeSubSubMenu, setACRBlackMagicFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicFullrange)
    const [ACRFabulousFullrangeSubSubMenu, setACRFabulousFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousFullrange)
    const [ACRExcellentFullrangeSubSubMenu, setACRExcellentFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentFullrange)
    const [ACRDeluxeFullrangeSubSubMenu, setACRDeluxeFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeFullrange)
    const [ACRClassicFullrangeSubSubMenu, setACRClassicFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicFullrange)
    const [CurveNoneFullrangeSubSubMenu, setCurveNoneFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneFullrange)
    const [ACRPremierFullrangeubSubMenu, setACRPremierFullrangeubSubMenu] = useState<NavbarComponents[]>(tempACRPremierFullrange)
    const [DesibelNoneFullrangeSubSubMenu, setDesibelNoneFullrangeSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneFullrange)

    const [ACRProMidrangeSubSubMenu, setACRProMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRProMidrange)
    const [ACRBlackMidrangeSubSubMenu, setACRBlackMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMidrange)
    const [ACRBlackMagicMidrangeSubSubMenu, setACRBlackMagicMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicMidrange)
    const [ACRFabulousMidrangeSubSubMenu, setACRFabulousMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousMidrange)
    const [ACRExcellentMidrangeSubSubMenu, setACRExcellentMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentMidrange)
    const [ACRDeluxeMidrangeSubSubMenu, setACRDeluxeMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeMidrange)
    const [ACRClassicMidrangeSubSubMenu, setACRClassicMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicMidrange)
    const [CurveNoneMidrangeSubSubMenu, setCurveNoneMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneMidrange)
    const [ACRPremierMidrangeubSubMenu, setACRPremierMidrangeubSubMenu] = useState<NavbarComponents[]>(tempACRPremierMidrange)
    const [DesibelNoneMidrangeSubSubMenu, setDesibelNoneMidrangeSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneMidrange)

    const [ACRProTweeterSubSubMenu, setACRProTweeterSubSubMenu] = useState<NavbarComponents[]>(tempACRProTweeter)
    const [ACRBlackTweeterSubSubMenu, setACRBlackTweeterSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackTweeter)
    const [ACRBlackMagicTweeterSubSubMenu, setACRBlackMagicTweeterSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicTweeter)
    const [ACRFabulousTweeterSubSubMenu, setACRFabulousTweeterSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousTweeter)
    const [ACRExcellentTweeterSubSubMenu, setACRExcellentTweeterSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentTweeter)
    const [ACRDeluxeTweeterSubSubMenu, setACRDeluxeTweeterSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeTweeter)
    const [ACRClassicTweeterSubSubMenu, setACRClassicTweeterSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicTweeter)
    const [CurveNoneTweeterSubSubMenu, setCurveNoneTweeterSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneTweeter)
    const [ACRPremierTweeterubSubMenu, setACRPremierTweeterubSubMenu] = useState<NavbarComponents[]>(tempACRPremierTweeter)
    const [DesibelNoneTweeterSubSubMenu, setDesibelNoneTweeterSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneTweeter)

    const [ACRProSparepartSubSubMenu, setACRProSparepartSubSubMenu] = useState<NavbarComponents[]>(tempACRProSparepart)
    const [ACRBlackSparepartSubSubMenu, setACRBlackSparepartSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackSparepart)
    const [ACRBlackMagicSparepartSubSubMenu, setACRBlackMagicSparepartSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicSparepart)
    const [ACRFabulousSparepartSubSubMenu, setACRFabulousSparepartSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousSparepart)
    const [ACRExcellentSparepartSubSubMenu, setACRExcellentSparepartSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentSparepart)
    const [ACRDeluxeSparepartSubSubMenu, setACRDeluxeSparepartSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeSparepart)
    const [ACRClassicSparepartSubSubMenu, setACRClassicSparepartSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicSparepart)
    const [CurveNoneSparepartSubSubMenu, setCurveNoneSparepartSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneSparepart)
    const [ACRPremierSparepartubSubMenu, setACRPremierSparepartubSubMenu] = useState<NavbarComponents[]>(tempACRPremierSparepart)
    const [DesibelNoneSparepartSubSubMenu, setDesibelNoneSparepartSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneSparepart)

    const [ACRProDiscontinuedSubSubMenu, setACRProDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempACRProDiscontinued)
    const [ACRBlackDiscontinuedSubSubMenu, setACRBlackDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackDiscontinued)
    const [ACRBlackMagicDiscontinuedSubSubMenu, setACRBlackMagicDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempACRBlackMagicDiscontinued)
    const [ACRFabulousDiscontinuedSubSubMenu, setACRFabulousDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempACRFabulousDiscontinued)
    const [ACRExcellentDiscontinuedSubSubMenu, setACRExcellentDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempACRExcellentDiscontinued)
    const [ACRDeluxeDiscontinuedSubSubMenu, setACRDeluxeDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempACRDeluxeDiscontinued)
    const [ACRClassicDiscontinuedSubSubMenu, setACRClassicDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempACRClassicDiscontinued)
    const [CurveNoneDiscontinuedSubSubMenu, setCurveNoneDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempCurveNoneDiscontinued)
    const [ACRPremierDiscontinuedubSubMenu, setACRPremierDiscontinuedubSubMenu] = useState<NavbarComponents[]>(tempACRPremierDiscontinued)
    const [DesibelNoneDiscontinuedSubSubMenu, setDesibelNoneDiscontinuedSubSubMenu] = useState<NavbarComponents[]>(tempDesibelNoneDiscontinued)



  
    //OTHER
    const [hoveredDriverSeries, setHoveredDriverSeries] = useState("");
  
  
    useEffect(() => {
      async function fetchData() {
        try {
          const navbarData: NavbarProducts[] = await getAllNavbarContent();
          // console.log("NAVBAR DATA: ", navbarData)
          setDriversSubMenu(EmptyMenu)
          navbarData.forEach((product) => {
            conditionsAndTemps.forEach(({ conditions, tempArray }) => {
              // console.log("tempArray", tempArray)
              
              const meetsConditions = conditions.every(condition =>
                product.categories.some(cat => cat.type === condition.type && cat.name === condition.name)
              );
              if (meetsConditions) {
                const isDuplicate = tempArray.some(item => item.title === product.name);
              
                if (!isDuplicate) {
                  tempArray.push({
                    title: product.name,
                    href: product.href,
                    parent: product.categories ? product.categories
                        .filter((cat) => cat.type === "Sub Sub Category" || cat.type === "Series")
                        .map((cat) => cat.name)
                      : [],
                    url: product.url,
                    slug: product.slug,
                    haveSparepart: product.haveSparepart
                  });
                  tempArray.sort((a, b) => {
                    const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');

                    const isNumber = (word: string) => !isNaN(parseFloat(word));

                    const wordA = getFirstWord(a.title);
                    const wordB = getFirstWord(b.title);

                    const isNumA = isNumber(wordA);
                    const isNumB = isNumber(wordB);

                    if (isNumA && isNumB) {
                      // Both start with numbers → sort numerically
                      return parseFloat(wordA) - parseFloat(wordB);
                    }

                    if (!isNumA && !isNumB) {
                      // Both start with words → sort alphabetically
                      return wordA.localeCompare(wordB);
                    }

                    // One is number, one is word → numbers come first
                    return isNumA ? -1 : 1;
                  });
                }
              }              
            });
          });
          

          setACRProAllSubSubMenu([...tempACRProAll, ...tempACRBlackAll, ...tempACRBlackMagicAll, ...tempACRClassicAll].sort((a, b) => {
              const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');
              const isNumber = (word: string) => !isNaN(parseFloat(word));
              const wordA = getFirstWord(a.title);
              const wordB = getFirstWord(b.title);
              const isNumA = isNumber(wordA);
              const isNumB = isNumber(wordB);
              if (isNumA && isNumB) {
                return parseFloat(wordA) - parseFloat(wordB);
              }
              if (!isNumA && !isNumB) {
                return wordA.localeCompare(wordB);
              }
              return isNumA ? -1 : 1;
          }))
          setACRBlackAllSubSubMenu([])
          setACRBlackMagicAllSubSubMenu([])
          setACRFabulousAllSubSubMenu(tempACRFabulousAll)
          setACRExcellentAllSubSubMenu(tempACRExcellentAll)
          setACRDeluxeAllSubSubMenu(tempACRDeluxeAll)
          setACRClassicAllSubSubMenu([])
          setCurveNoneAllSubSubMenu(tempCurveNoneAll)
          setACRPremierAllubSubMenu(tempACRPremierAll)
          setDesibelNoneAllSubSubMenu(tempDesibelNoneAll)

          setACRProSubwooferSubSubMenu([...tempACRProSubwoofer, ...tempACRBlackSubwoofer, ...tempACRBlackMagicSubwoofer, ...tempACRClassicSubwoofer].sort((a, b) => {
              const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');
              const isNumber = (word: string) => !isNaN(parseFloat(word));
              const wordA = getFirstWord(a.title);
              const wordB = getFirstWord(b.title);
              const isNumA = isNumber(wordA);
              const isNumB = isNumber(wordB);
              if (isNumA && isNumB) {
                return parseFloat(wordA) - parseFloat(wordB);
              }
              if (!isNumA && !isNumB) {
                return wordA.localeCompare(wordB);
              }
              return isNumA ? -1 : 1;
          }))
          setACRBlackSubwooferSubSubMenu([])
          setACRBlackMagicSubwooferSubSubMenu([])
          setACRFabulousSubwooferSubSubMenu(tempACRFabulousSubwoofer)
          setACRExcellentSubwooferSubSubMenu(tempACRExcellentSubwoofer)
          setACRDeluxeSubwooferSubSubMenu(tempACRDeluxeSubwoofer)
          setACRClassicSubwooferSubSubMenu([])
          setCurveNoneSubwooferSubSubMenu(tempCurveNoneSubwoofer)
          setACRPremierSubwooferubSubMenu(tempACRPremierSubwoofer)
          setDesibelNoneSubwooferSubSubMenu(tempDesibelNoneSubwoofer)

          setACRProWooferSubSubMenu([...tempACRProWoofer, ...tempACRBlackWoofer, ...tempACRBlackMagicWoofer, ...tempACRClassicWoofer].sort((a, b) => {
              const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');
              const isNumber = (word: string) => !isNaN(parseFloat(word));
              const wordA = getFirstWord(a.title);
              const wordB = getFirstWord(b.title);
              const isNumA = isNumber(wordA);
              const isNumB = isNumber(wordB);
              if (isNumA && isNumB) {
                return parseFloat(wordA) - parseFloat(wordB);
              }
              if (!isNumA && !isNumB) {
                return wordA.localeCompare(wordB);
              }
              return isNumA ? -1 : 1;
          }))
          setACRBlackWooferSubSubMenu([])
          setACRBlackMagicWooferSubSubMenu([])
          setACRFabulousWooferSubSubMenu(tempACRFabulousWoofer)
          setACRExcellentWooferSubSubMenu(tempACRExcellentWoofer)
          setACRDeluxeWooferSubSubMenu(tempACRDeluxeWoofer)
          setACRClassicWooferSubSubMenu([])
          setCurveNoneWooferSubSubMenu(tempCurveNoneWoofer)
          setACRPremierWooferubSubMenu(tempACRPremierWoofer)
          setDesibelNoneWooferSubSubMenu(tempDesibelNoneWoofer)
          // console.log("tempDesibelNoneWoofer: ", tempDesibelNoneWoofer)

          setACRProFullrangeSubSubMenu([...tempACRProFullrange, ...tempACRBlackFullrange, ...tempACRBlackMagicFullrange, ...tempACRClassicFullrange].sort((a, b) => {
              const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');
              const isNumber = (word: string) => !isNaN(parseFloat(word));
              const wordA = getFirstWord(a.title);
              const wordB = getFirstWord(b.title);
              const isNumA = isNumber(wordA);
              const isNumB = isNumber(wordB);
              if (isNumA && isNumB) {
                return parseFloat(wordA) - parseFloat(wordB);
              }
              if (!isNumA && !isNumB) {
                return wordA.localeCompare(wordB);
              }
              return isNumA ? -1 : 1;
          }))
          setACRBlackFullrangeSubSubMenu([])
          setACRBlackMagicFullrangeSubSubMenu([])
          setACRFabulousFullrangeSubSubMenu(tempACRFabulousFullrange)
          setACRExcellentFullrangeSubSubMenu(tempACRExcellentFullrange)
          setACRDeluxeFullrangeSubSubMenu(tempACRDeluxeFullrange)
          setACRClassicFullrangeSubSubMenu([])
          setCurveNoneFullrangeSubSubMenu(tempCurveNoneFullrange)
          setACRPremierFullrangeubSubMenu(tempACRPremierFullrange)
          setDesibelNoneFullrangeSubSubMenu(tempDesibelNoneFullrange)

          setACRProMidrangeSubSubMenu([...tempACRProMidrange, ...tempACRBlackMidrange, ...tempACRBlackMagicMidrange, ...tempACRClassicMidrange].sort((a, b) => {
              const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');
              const isNumber = (word: string) => !isNaN(parseFloat(word));
              const wordA = getFirstWord(a.title);
              const wordB = getFirstWord(b.title);
              const isNumA = isNumber(wordA);
              const isNumB = isNumber(wordB);
              if (isNumA && isNumB) {
                return parseFloat(wordA) - parseFloat(wordB);
              }
              if (!isNumA && !isNumB) {
                return wordA.localeCompare(wordB);
              }
              return isNumA ? -1 : 1;
          }))
          setACRBlackMidrangeSubSubMenu([])
          setACRBlackMagicMidrangeSubSubMenu([])
          setACRFabulousMidrangeSubSubMenu(tempACRFabulousMidrange)
          setACRExcellentMidrangeSubSubMenu(tempACRExcellentMidrange)
          setACRDeluxeMidrangeSubSubMenu(tempACRDeluxeMidrange)
          setACRClassicMidrangeSubSubMenu([])
          setCurveNoneMidrangeSubSubMenu(tempCurveNoneMidrange)
          setACRPremierMidrangeubSubMenu(tempACRPremierMidrange)
          setDesibelNoneMidrangeSubSubMenu(tempDesibelNoneMidrange)

          setACRProTweeterSubSubMenu([...tempACRProTweeter, ...tempACRBlackTweeter, ...tempACRBlackMagicTweeter, ...tempACRClassicTweeter].sort((a, b) => {
              const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');
              const isNumber = (word: string) => !isNaN(parseFloat(word));
              const wordA = getFirstWord(a.title);
              const wordB = getFirstWord(b.title);
              const isNumA = isNumber(wordA);
              const isNumB = isNumber(wordB);
              if (isNumA && isNumB) {
                return parseFloat(wordA) - parseFloat(wordB);
              }
              if (!isNumA && !isNumB) {
                return wordA.localeCompare(wordB);
              }
              return isNumA ? -1 : 1;
          }))
          setACRBlackTweeterSubSubMenu([])
          setACRBlackMagicTweeterSubSubMenu([])
          setACRFabulousTweeterSubSubMenu(tempACRFabulousTweeter)
          setACRExcellentTweeterSubSubMenu(tempACRExcellentTweeter)
          setACRDeluxeTweeterSubSubMenu(tempACRDeluxeTweeter)
          setACRClassicTweeterSubSubMenu([])
          setCurveNoneTweeterSubSubMenu(tempCurveNoneTweeter)
          setACRPremierTweeterubSubMenu(tempACRPremierTweeter)
          setDesibelNoneTweeterSubSubMenu(tempDesibelNoneTweeter)

          setACRProSparepartSubSubMenu(tempACRProSparepart)
          setACRBlackSparepartSubSubMenu(tempACRBlackSparepart)
          setACRBlackMagicSparepartSubSubMenu(tempACRBlackMagicSparepart)
          setACRFabulousSparepartSubSubMenu(tempACRFabulousSparepart)
          setACRExcellentSparepartSubSubMenu(tempACRExcellentSparepart)
          setACRDeluxeSparepartSubSubMenu(tempACRDeluxeSparepart)
          setACRClassicSparepartSubSubMenu(tempACRClassicSparepart)
          setCurveNoneSparepartSubSubMenu(tempCurveNoneSparepart)
          setACRPremierSparepartubSubMenu(tempACRPremierSparepart)
          setDesibelNoneSparepartSubSubMenu(tempDesibelNoneSparepart)

          setACRProDiscontinuedSubSubMenu([...tempACRProDiscontinued, ...tempACRBlackDiscontinued, ...tempACRBlackMagicDiscontinued, ...tempACRClassicDiscontinued].sort((a, b) => {
              const getFirstWord = (title: string) => title.split(' ')[0].replace(/"/g, '');
              const isNumber = (word: string) => !isNaN(parseFloat(word));
              const wordA = getFirstWord(a.title);
              const wordB = getFirstWord(b.title);
              const isNumA = isNumber(wordA);
              const isNumB = isNumber(wordB);
              if (isNumA && isNumB) {
                return parseFloat(wordA) - parseFloat(wordB);
              }
              if (!isNumA && !isNumB) {
                return wordA.localeCompare(wordB);
              }
              return isNumA ? -1 : 1;
          }))
          setACRBlackDiscontinuedSubSubMenu([])
          setACRBlackMagicDiscontinuedSubSubMenu([])
          setACRFabulousDiscontinuedSubSubMenu(tempACRFabulousDiscontinued)
          setACRExcellentDiscontinuedSubSubMenu(tempACRExcellentDiscontinued)
          setACRDeluxeDiscontinuedSubSubMenu(tempACRDeluxeDiscontinued)
          setACRClassicDiscontinuedSubSubMenu([])
          setCurveNoneDiscontinuedSubSubMenu(tempCurveNoneDiscontinued)
          setACRPremierDiscontinuedubSubMenu(tempACRPremierDiscontinued)
          setDesibelNoneDiscontinuedSubSubMenu(tempDesibelNoneDiscontinued)



          setLoading(false);
        } catch (error) {
          console.error('Error fetching navbar products:', error);
        }
      }
      fetchData();
      
    }, []);
  
      function searchSubSubMenu(submenu: string){
        setLoadingSubSubMenu(true)
        if(submenu === "ALL DRIVERS"){ 
          setDriversSubSubMenu(
            [ ACRProAllSubSubMenu, 
              ACRBlackAllSubSubMenu, 
              ACRBlackMagicAllSubSubMenu, 
              ACRFabulousAllSubSubMenu, 
              ACRExcellentAllSubSubMenu, 
              ACRDeluxeAllSubSubMenu, 
              ACRClassicAllSubSubMenu, 
              CurveNoneAllSubSubMenu, 
              ACRPremierAllubSubMenu, 
              DesibelNoneAllSubSubMenu])
        }
        else if(submenu === "SUBWOOFER"){ 
          setDriversSubSubMenu(
            [ACRProSubwooferSubSubMenu, ACRBlackSubwooferSubSubMenu, ACRBlackMagicSubwooferSubSubMenu, ACRFabulousSubwooferSubSubMenu, ACRExcellentSubwooferSubSubMenu, ACRDeluxeSubwooferSubSubMenu, ACRClassicSubwooferSubSubMenu, CurveNoneSubwooferSubSubMenu, ACRPremierSubwooferubSubMenu, DesibelNoneSubwooferSubSubMenu])
        }
        else if(submenu === "WOOFER"){ 
          setDriversSubSubMenu(
            [ACRProWooferSubSubMenu, ACRBlackWooferSubSubMenu, ACRBlackMagicWooferSubSubMenu, ACRFabulousWooferSubSubMenu, ACRExcellentWooferSubSubMenu, ACRDeluxeWooferSubSubMenu, ACRClassicWooferSubSubMenu, CurveNoneWooferSubSubMenu, ACRPremierWooferubSubMenu, DesibelNoneWooferSubSubMenu])
        }
        else if(submenu === "FULLRANGE"){ 
          setDriversSubSubMenu(
            [ACRProFullrangeSubSubMenu, ACRBlackFullrangeSubSubMenu, ACRBlackMagicFullrangeSubSubMenu, ACRFabulousFullrangeSubSubMenu, ACRExcellentFullrangeSubSubMenu, ACRDeluxeFullrangeSubSubMenu, ACRClassicFullrangeSubSubMenu, CurveNoneFullrangeSubSubMenu, ACRPremierFullrangeubSubMenu, DesibelNoneFullrangeSubSubMenu])
        }
        else if(submenu === "MIDRANGE"){ 
          setDriversSubSubMenu(
            [ACRProMidrangeSubSubMenu, ACRBlackMidrangeSubSubMenu, ACRBlackMagicMidrangeSubSubMenu, ACRFabulousMidrangeSubSubMenu, ACRExcellentMidrangeSubSubMenu, ACRDeluxeMidrangeSubSubMenu, ACRClassicMidrangeSubSubMenu, CurveNoneMidrangeSubSubMenu, ACRPremierMidrangeubSubMenu, DesibelNoneMidrangeSubSubMenu])
        }
        else if(submenu === "TWEETER"){
          setDriversSubSubMenu(
            [ACRProTweeterSubSubMenu, ACRBlackTweeterSubSubMenu, ACRBlackMagicTweeterSubSubMenu, ACRFabulousTweeterSubSubMenu, ACRExcellentTweeterSubSubMenu, ACRDeluxeTweeterSubSubMenu, ACRClassicTweeterSubSubMenu, CurveNoneTweeterSubSubMenu, ACRPremierTweeterubSubMenu, DesibelNoneTweeterSubSubMenu])
        }
        else if(submenu === "SPAREPART"){
          setDriversSubSubMenu(
            [ACRProSparepartSubSubMenu, ACRBlackSparepartSubSubMenu, ACRBlackMagicSparepartSubSubMenu, ACRFabulousSparepartSubSubMenu, ACRExcellentSparepartSubSubMenu, ACRDeluxeSparepartSubSubMenu, ACRClassicSparepartSubSubMenu, CurveNoneSparepartSubSubMenu, ACRPremierSparepartubSubMenu, DesibelNoneSparepartSubSubMenu])
        }
        else if(submenu === "DISCONTINUED"){ 
          setDriversSubSubMenu(
            [ACRProDiscontinuedSubSubMenu, ACRBlackDiscontinuedSubSubMenu, ACRBlackMagicDiscontinuedSubSubMenu, ACRFabulousDiscontinuedSubSubMenu, ACRExcellentDiscontinuedSubSubMenu, ACRDeluxeDiscontinuedSubSubMenu, ACRClassicDiscontinuedSubSubMenu, CurveNoneDiscontinuedSubSubMenu, ACRPremierDiscontinuedubSubMenu, DesibelNoneDiscontinuedSubSubMenu])
        }

        setLoadingSubSubMenu(false)
      }
      
      async function searchFeaturedProduct(slug: string) {
        setLoadingFeatured(true)
        const data = await getProductsForNavbar(slug)
        setFeaturedProduct(data)
        setLoadingFeatured(false)
      }

    return(
      loading?
        <div className="fixed left-0 right-0 w-full h-screen items-center justify-center shadow-md bg-secondary-foreground flex">
          <Loader />
        </div>
      :
        <NavigationMenuContent>
          <div className="fixed bottom-0 left-0 right-0 w-full shadow-md bg-secondary-foreground flex">
            <div className="px-10 xl:px-24 lg:px-16 flex container mx-auto">
              <div className="w-4/5 h-[calc(100vh-80px)]">
                <div className="flex justify-between">
                  <div className="h-fit z-40 w-full flex justify-between">
                    <ul className="flex justify-between w-full border-b-2 border-foreground">
                      <NavigationMenuLink href={locale === 'id' ? '/driver' : `/${locale}/drivers`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out  text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "ALL DRIVERS" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("ALL DRIVERS"),
                          setDriversSubMenu(AllDriversSubMenu),
                          searchSubSubMenu("ALL DRIVERS")
                          ]}>
                          ALL
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "ALL DRIVERS" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={locale === 'id' ? '/driver/subwoofer' : `/${locale}/drivers/subwoofer`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "SUBWOOFER" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("SUBWOOFER"),
                          setDriversSubMenu(SubwooferSubMenu),
                          searchSubSubMenu("SUBWOOFER")
                          ]}>
                          SUBWOOFER
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "SUBWOOFER" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={locale === 'id' ? '/driver/woofer' : `/${locale}/drivers/woofer`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "WOOFER" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("WOOFER"),
                          setDriversSubMenu(WooferSubMenu),
                          searchSubSubMenu("WOOFER")
                          ]}>
                          WOOFER
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "WOOFER" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={locale === 'id' ? '/driver/full-range' : `/${locale}/drivers/full-range`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "FULLRANGE" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("FULLRANGE"),
                          setDriversSubMenu(FullrangeSubMenu),
                          searchSubSubMenu("FULLRANGE")
                          ]}>
                          FULLRANGE
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "FULLRANGE" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={locale === 'id' ? '/driver/midrange' : `/${locale}/drivers/midrange`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "MIDRANGE" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("MIDRANGE"),
                          setDriversSubMenu(MidrangeSubMenu),
                          searchSubSubMenu("MIDRANGE")
                          ]}>
                          MIDRANGE
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "MIDRANGE" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={locale === 'id' ? '/driver/tweeter' : `/${locale}/drivers/tweeter`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "TWEETER" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("TWEETER"),
                          setDriversSubMenu(TweeterSubMenu),
                          searchSubSubMenu("TWEETER")
                          ]}>
                          TWEETER
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "TWEETER" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>

                      <NavigationMenuLink href={locale === 'id' ? '/sparepart' : `/${locale}/spareparts`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "SPAREPART" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("SPAREPART"),
                          setDriversSubMenu(SparepartSubMenu),
                          searchSubSubMenu("SPAREPART")
                          ]}>
                          SPAREPART
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "SPAREPART" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>

                      <NavigationMenuLink href={locale === 'id' ? '/driver/discontinued' : `/${locale}/drivers/discontinued`} className="w-fit">
                        <div className={`py-4 px-2 flex justify-center items-center align-middle text-sm hover:text-primary transition-all duration-300 ease-in-out text-background hover:cursor-pointer border-b-4 ${hoveredDriverSeries === "DISCONTINUED" ? 'text-primary border-primary' : 'border-transparent'}`} onMouseEnter={() => [
                          setHoveredDriverSeries("DISCONTINUED"),
                          setDriversSubMenu(DiscontinuedSubMenu),
                          searchSubSubMenu("DISCONTINUED")
                          ]}>
                          DISCONTINUED
                          <ChevronDown
                            className={`relative top-px ml-1 h-3 w-3 transition duration-200 ${hoveredDriverSeries === "DISCONTINUED" ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </NavigationMenuLink>
                    </ul>
                  </div>
                </div>
                <div className={`${driversubMenu[0].title === "" ? "pb-0" : "pb-8"}`}>
                <div className={`${driversubMenu[0].title === "" ? "hidden" : "grid grid-cols-4 py-8 text-background h-[calc(100vh-140px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-background scrollbar-track-secondary-foreground"}`}>
                {loadingSubSubMenu ? 
                  <div className="fixed left-0 right-0 w-full h-screen items-center justify-center shadow-md bg-secondary-foreground flex">
                    <Loader />
                  </div>
                  :
                  driversubMenu
                    .map((submenu, index) => ({ submenu, subsub: driversubsubMenu[index] }))
                    .sort((a, b) => (a.subsub?.length || 0) - (b.subsub?.length || 0))
                    .filter(({ subsub }) => subsub && subsub.length > 0 && subsub[0].title !== '')
                    .map(({ submenu, subsub }, index) => submenu && (
                      <div key={submenu.title} className={`${(index + 1) % 4 !== 0 ? 'border-r' : ''}`}>
                        <NavigationMenuLink
                          href={locale === 'id' ? submenu.href : `/${locale}${submenu.href}`}
                          className="font-bold w-full flex items-end justify-center px-6 pt-8 h-12"
                        >
                          <LazyImageCustom
                            src={submenu.url? submenu.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${submenu.url}` : submenu.url : '/images/acr/series_logo/acr_black_bg.webp'}
                            alt={submenu.title? submenu.title : 'ACR'}
                            width={400}
                            height={200}
                            classname={`max-h-[30px] min-h-[20px] w-auto object-contain hover:scale-110 transition-all duration-300 ease-in-out`}
                            lazy={false}
                          />
                        </NavigationMenuLink>
                        <div className="pt-4">
                          {subsub.map((subsubmenu, index) => (
                            <NavigationMenuLink
                              key={index}
                              href={subsubmenu.href ? locale === 'id' ? subsubmenu.href : `/${locale}${subsubmenu.href}` : locale === 'id' ? '/' : `/${locale}`}
                              onMouseEnter={() => searchFeaturedProduct(subsubmenu.slug)}
                            >
                              <div
                                className={`px-8 text-sm py-2 hover:text-primary transition-all duration-300 ease-in-out hover:cursor-pointer ${
                                  FeaturedProduct?.slug === subsubmenu.slug && "text-primary"
                                }`}
                              >
                                {subsubmenu.title}
                              </div>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    )
                  )
                }
                </div>
              




                </div>
              </div>
              <div className="w-1/5 bg-secondary/10 h-[calc(100vh-80px)] overflow-y-scroll scrollbar-none scrollbar-thumb-background scrollbar-track-secondary p-4 flex justify-center text-center">
                  {FeaturedProduct && (
                    FeaturedProduct === null ?
                    <div className="h-full flex justify-center items-center text-background">
                      {t('navbar-content-placeholder')}
                    </div>
                  :
                    loadingFeatured?
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                            <Loader/>
                        </div>
                      </div>
                  :
                    <div className="pb-4">
                      <div className="flex items-center justify-center py-2">
                        <LazyImageCustom
                          src={`/images/acr/series_logo/${
                            FeaturedProduct.series && FeaturedProduct.series != "" ? 
                            FeaturedProduct.series === "Black" ?
                                "acr_black_bg.webp"
                              :  
                              FeaturedProduct.series === "Black Magic" ?
                                "acr_black_bg.webp"
                              :  
                              FeaturedProduct.series === "Premier" ?
                                "premier_black_bg.webp"
                              :
                              FeaturedProduct.series === "Excellent" ?
                                "excellent_black_bg.webp"
                              :
                              FeaturedProduct.series === "Deluxe" ?
                                "deluxe_black_bg.webp"
                              :
                              FeaturedProduct.series === "Classic" ?
                                "acr_black_bg.webp"
                              :
                              FeaturedProduct.series === "Fabulous" ?
                                "fabulous_black_bg.webp"
                              :
                                "acr_black_bg.webp"
                            :
                            FeaturedProduct.subcat === "Curve" ?
                                "curve_black_bg.webp"
                            :
                            FeaturedProduct.subcat === "Desibel" ?
                                "desibel_black_bg.webp"
                            :
                                "acr_black_bg.webp"
            
                          }`} 
                          alt={'Logo Series'} 
                          width={500}
                          height={500}
                          classname="h-6 w-auto"
                          lazy={false}
                        />
                      </div>   
                      <div className="my-4 h-28 flex w-full justify-center items-center text-center">
                        <LazyImageCustom src={FeaturedProduct.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${FeaturedProduct.url}` : FeaturedProduct.url} alt={FeaturedProduct.label} width={400} height={400} classname="w-auto h-full " lazy={false}/>
                      </div>

                      {FeaturedProduct.haveSparepart && 
                        <div className="mb-4">
                          <NavigationMenuLink href={locale === 'id' ? '/sparepart' : `/${locale}/spareparts`}>
                            <div className="bg-primary hover:bg-background hover:text-primary transform duration-300 ease-in-out rounded-lg p-2 text-sm text-background font-bold">
                              {t('navbar-content-have-sparepart')}
                            </div>
                          </NavigationMenuLink>
                        </div>
                      }

                      <div className="font-bold text-base line-clamp-2 text-background">
                        {FeaturedProduct.label}
                      </div>
                      
                      <div className="text-base mb-4 line-clamp-2 text-background">
                        {FeaturedProduct.categoryDetails}
                      </div>
                      {FeaturedProduct.spec && FeaturedProduct.spec.length > 0 &&
                        <div className="bg-secondary-foreground rounded-lg p-2 text-sm text-background">
                          {FeaturedProduct.spec.map((val: ChildSpecificationProp) => 
                            locale === 'en' ?
                            <>
                              <div>
                                {val.childnameEnglish}
                              </div>
                              <div className="font-bold pb-2">
                                {val.value} {val.unit}
                              </div>
                            </>
                            :
                            <>
                              <div>
                                {val.childnameIndo}
                              </div>
                              <div className="font-bold pb-2">
                                {val.value} {val.unit}
                              </div>
                            </>
                          )}
                        </div>
                      }
                    </div>
                )}
              </div>
            </div>
          </div>
        </NavigationMenuContent>
    )
}

export default NavbarContent