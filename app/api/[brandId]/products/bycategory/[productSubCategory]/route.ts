import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ productSubCategory: string }> }) {
  const params = await props.params;
  try {
    if (!params.productSubCategory) {
      return new NextResponse("Product Sub Category is required", { status: 400 });
    }
    
    let productIds: string[] = [];
    if(params.productSubCategory === "curve" || params.productSubCategory === "desibel" || params.productSubCategory === "acr"){
      const product =  await prismadb.allProductCategory.findMany({
        where:{
            slug: params.productSubCategory,
            type: 'Sub Category'
        },
        select:{
            productId: true
        }
      })
      productIds = product.map((item) => item.productId);
    }
    else if(params.productSubCategory === "horn" || params.productSubCategory === "tweeter" || params.productSubCategory === "discontinued" || params.productSubCategory === "midbass" || params.productSubCategory === "woofer" || params.productSubCategory === "compression-driver" || params.productSubCategory === "full-range" || params.productSubCategory === "midrange" || params.productSubCategory === "ceiling" || params.productSubCategory === "subwoofer"){
      const product =  await prismadb.allProductCategory.findMany({
        where:{
            slug: params.productSubCategory,
            type: 'Sub Sub Category'
        },
        select:{
            productId: true
        }
      })
      productIds = product.map((item) => item.productId);
    }
    else{
      const product =  await prismadb.allProductCategory.findMany({
        where:{
            slug: params.productSubCategory,
            type: 'Series'
        },
        select:{
            productId: true
        }
      })
      productIds = product.map((item) => item.productId);
    }

    // const productIds = productIdbyCat.map((value) => value.productId)

    const product = await prismadb.product.findMany({
      where: {
        id:{
          in: productIds
        },
        isArchived: false,
        allCat: {
          some: {
            type: 'Category',
            name: 'Drivers'
          }
        }
      },
      select: {
        id: true,
        slug: true,
        name: true,
        allCat: {
          select: {
            id: true,
            type: true,
            name: true,
            slug: true
          }
        },
        specification: {
          select: {
            voice_coil_diameter: true,
            spl: true,
            impedansi: true,
            program_power: true,
          }
        },
        cover_img: {
          select: {
            url: true
          }
        },
        size: {
          select: {
            value: true,
            name: true
          }
        },
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_BY_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};