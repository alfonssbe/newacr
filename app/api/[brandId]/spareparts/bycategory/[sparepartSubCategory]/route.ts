import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ sparepartSubCategory: string }> }) {
  const params = await props.params;
  try {
    if (!params.sparepartSubCategory) {
      return new NextResponse("Sparepart Sub Category is required", { status: 400 });
    }
    
    let productIds: string[] = [];
    if(params.sparepartSubCategory === "curve" || params.sparepartSubCategory === "desibel" || params.sparepartSubCategory === "acr"){
      const product =  await prismadb.allProductCategory.findMany({
        where:{
            slug: params.sparepartSubCategory,
            type: 'Sub Category'
        },
        select:{
            productId: true
        }
      })
      productIds = product.map((item) => item.productId);
    }
    else if(params.sparepartSubCategory === "horn" || params.sparepartSubCategory === "tweeter" || params.sparepartSubCategory === "discontinued" || params.sparepartSubCategory === "midbass" || params.sparepartSubCategory === "woofer" || params.sparepartSubCategory === "compression-driver" || params.sparepartSubCategory === "full-range" || params.sparepartSubCategory === "midrange" || params.sparepartSubCategory === "ceiling" || params.sparepartSubCategory === "subwoofer"){
      const product =  await prismadb.allProductCategory.findMany({
        where:{
            slug: params.sparepartSubCategory,
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
            slug: params.sparepartSubCategory,
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
            name: 'Spareparts'
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
    console.log('[SPAREPART_BY_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};