import { Prisma } from "@prisma/client";

export interface Products {
    id: string;
    name: string;
    slug: string;
    coverUrl: string;
    CoverAlt: string;
    size: Size;
    series: AllCategory[];
    categories: AllCategory[];
    sub_categories: AllCategory[];
    sub_sub_categories: AllCategory[];
    specification: Specifications;
}

export interface FeaturedProducts {
    id: string;
    name: string;
    slug: string;
    featuredImgUrl: string;
    featuredDesc: string;
    series: string;
}

export interface Hero {
    id: string;
    name: string;
    featuredDesc: string;
    slug: string;
    imgUrl: string;
    buttonDesc: string;
    buttonLink: string;
}

export interface NewsType {
    id: string;
    title: string;
    slug: string;
    link_url: string;
    link_placeholder: string;
    description: string;
    news_img_url: string;
    event_date: Date;
    updatedAt: string;
}

export interface Size {
    value: number;
    label: string;
}

export interface Searchbox {
    value: string;
    label: string;
    slug: string;
    url: string;
    categoryDetails: string;
}

export interface NavbarFeaturedProduct {
    value: string;
    label: string;
    slug: string;
    url: string;
    haveSparepart: boolean;
    categoryDetails: string;
    spec: Specifications;
    series: string;
    subcat: string;
}

export interface AllCategory {
    id: string;
    name: string;
    slug: string;
}

export interface NavbarCategory {
    name: string;
    type: string;
}

export interface SubCategoryFilters {
    id: string;
    productId: string;
    categoryId: string;
    type: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface NavbarProducts {
    name: string;
    href: string;
    categories: NavbarCategory[]
    url: string;
    slug: string;
    haveSparepart: boolean;
}

export interface Specifications {
    diameter_speaker: string;
    daya_maksimum: string;
    lebar_daerah_frekuensi: string;
    spl: string;
    medan_magnet: string;
    berat_magnet: string;
    voice_coil_diameter: string;
    impedansi: string;
    nominal_power_handling: string;
    program_power: string;
    voice_coil_material: string;
    berat_speaker: string;
    custom_note: string;
    deskripsi_sparepart: string;
    isi_per_dus_sparepart: string;
}

export interface Horn_Specifications {
    diameter_throat: string
    ukuran: string
    material: string
}

export interface Ceiling_Specifications {
    model: string
    type: string
    input: string
    rated_impedance: string
    sensitivity: string
    frequency_response: string
    line_voltage: string
    speaker_component: string
    weight: string
    material: string
    accessory: string
    rated_power: string
}

export interface Thiele_Small_Parameters_Specifications {
    fs: string
    dcr: string
    qts: string
    qes: string
    qms: string
    mms: string
    cms: string
    bl_product: string
    vas: string
    no: string
    sd: string
    x_max: string
}

export interface Datasheet_Prod {
    productId: string
    name: string
    url: string
    id: string
}

export interface AllProductsForHome {
    allProducts: Products[];
    allSPL: number[];
    allVoiceCoilDiameter: number[];
    allSubSubCategory: string[];
    allSubCategory: string[];
    allSeries: string[];
}

export interface SingleProducts {
    coverImg: FilesProp;
    datasheet: FilesProp[];
    images_Catalogues: FilesProp[];
    drawing: FilesProp[];
    graph: FilesProp[];
    impedance: FilesProp[];
    size: Size;
    categories: AllCategory[];
    sub_categories: AllCategory[];
    sub_sub_categories: AllCategory[];
    series: AllCategory[];
    specification: SpecificationProp[];
    id: string;
    name: string;
    desc: string;
    slug: string;
    have_sparepart: boolean;
}

export interface MetadataSingleProducts {
    name: string;
    slug: string;
    coverUrl: string;
    coverAlt: string;
    size: Size;
}

export interface ComparisonProductData {
    id: string;
    name: string;
    desc: string;
    slug: string;
    coverUrl: string;
    coverAlt: string;
    graph_Url: string[];
    impedance_Url: string[];
    sub_sub_categories: AllCategory[];
    specification: Specifications;
}

export interface CachedAllProducts {
    allproduct: AllProductsForHome;
    allsizes: number[];
}

export interface activeSlider{
    parentName: string;
    slug: string;
    bottomVal: number;
    topVal: number;
    bottomRealVal: number;
    topRealVal: number;
    unit: string;
}

export interface activeCheckbox{
    parentName: string;
    slug: string;
    name: string;
    unit: string;
}

export interface categoriesHeader{
    name: string;
    description: string;
}

export interface SliderDataNews{
    name: string;
    slug: string;
    value: number[];
    realDate: string[];
    unit: string;
    max_index: number;
    min_index: number;
    minIndex: number // Index in the data array
    maxIndex: number // Index in the data array
}

export interface SliderData{
  slug: string
  name: string
  minIndex: number // Index in the data array
  maxIndex: number // Index in the data array
  min_index: number // Minimum possible index
  max_index: number // Maximum possible index
  unit: string
  value: number[] // Array of actual values
}

export interface CheckBoxData{
    name: string;
    slug: string;
    value: string[];
    unit: string;
}

export interface NavbarComponents{
    title: string,
    href: string,
    parent: string[],
    url: string,
    slug: string,
    haveSparepart: boolean;
}

export interface PriorityMenu{
    priorityId: string,
    productId: string,
    productNameEnglish: string,
    priority: string,
    menuType: string
    categoryId: string,
    categoryName: string
}

export interface SpecificationProp {
  parentname: string
  subparentname: string
  child: ChildSpecificationProp[]
}

export interface ChildSpecificationProp {
  childnameIndo: string
  childnameEnglish: string
  value: string
  slugIndo: string
  slugEnglish: string
  notes: string
  unit: string
}


export type SingleProductsType = Prisma.ProductGetPayload<{
  include: {
    allCat: true
    images_catalogues: true
    drawing_img: true
    graph_img: true
    impedance_img: true
    cover_img: true
    size: true
    multipleDatasheetProduct: true
    connectorSpecifications: true
  };
}>;

export interface FilesProp{
    name: string
    url: string
    productId: string
}

export interface AllProductsJsonType {
  name: string
  id: string
  slug: string
  cover_img: {
    url: string
  }
  allCat: {
    name: string
    slug: string
    type: string
  }[]
};

export interface AllFilterProductsOnlyType {
  products: AllProductsJsonType
  size: {
    name: string
    value: string
  },
  specs: ChildSpecificationProp[]
}