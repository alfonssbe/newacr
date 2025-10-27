import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/app/admin/actions';
import { Cover_Image, Drawing_Image, Graph_Image, Image_Catalogues, Impedance_Image, multipleDatasheetProduct } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  const strWithoutSatori = strBeforeSlash.replace(/SATORI/gi, '');
  return strWithoutSatori.toLowerCase()
                        .replace(/\+/g, 'plus')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
};

export async function POST(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn || !session){
      return NextResponse.json("expired_session")
    }
    
    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    const body = await req.json();

    const { name, sizeId,  description, description_english, isFeatured, isArchived, isNewProduct, isHorn, isCeiling, haveSparepart, images_catalogues, cover_img, drawing_img, graph_img, impedance_img, multipleDatasheetProduct, series } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const duplicates = await prismadb.product.findFirst({
      where:{
        name,
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    const product = await prismadb.product.create({
      data: {
        name: name,
        slug: slugify(name),
        description,
        description_english,
        isFeatured,
        isArchived,
        isNewProduct,
        isHorn,
        isCeiling,
        haveSparepart,
        sizeId,
        series,
        specId: "0",
        updatedBy: session.name,
        brandId: params.brandId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });



    if(images_catalogues.length!=0){
      images_catalogues.map(async (value: Image_Catalogues) => {
        if(value.url!=''){
          await prismadb.image_Catalogues.create({
            data:{
              productId: product.id,
              url:value.url,
              name: value.name,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    if(multipleDatasheetProduct.length!=0){
      multipleDatasheetProduct.map(async (datasheet: multipleDatasheetProduct) => {
        if(datasheet.url!=''){
          await prismadb.multipleDatasheetProduct.create({
            data:{
              productId: product.id,
              url:datasheet.url,
              name: datasheet.name
            }
          })
        }
      })
    }

    if(cover_img.length!=0){
      cover_img.map(async (value: Cover_Image) => {
        if(value.url!=''){
          await prismadb.cover_Image.create({
            data:{
              productId: product.id,
              url:value.url,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    if(drawing_img.length!=0){
      drawing_img.map(async (value: Drawing_Image) => {
        if(value.url!=''){
          await prismadb.drawing_Image.create({
            data:{
              productId: product.id,
              url:value.url,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    if(graph_img.length!=0){
      graph_img.map(async (value: Graph_Image) => {
        if(value.url!=''){
          await prismadb.graph_Image.create({
            data:{
              productId: product.id,
              url:value.url,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    if(impedance_img.length!=0){
      impedance_img.map(async (value: Impedance_Image) => {
        if(value.url!=''){
          await prismadb.impedance_Image.create({
            data:{
              productId: product.id,
              url:value.url,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    const spec = await prismadb.specification.create({
      data: {
        diameter_speaker:'',
        daya_maksimum:'',
        lebar_daerah_frekuensi  :'',
        spl  :'',
        medan_magnet :'',
        berat_magnet :'',
        voice_coil_diameter  :'',
        impedansi :'',
        nominal_power_handling :'',
        program_power :'',
        voice_coil_material :'',
        berat_speaker :'',
        custom_note:'',
        deskripsi_sparepart: '',
        isi_per_dus_sparepart: '',
        productId: product.id,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    });

    
    await prismadb.product.update({
      where:{
        id: product.id
      },
      data: {
        specId: spec.id,
        updatedBy: session.name,
        updatedAt: new Date()
      }
    });

    revalidatePath(`/produk/${product.slug}`)
    revalidatePath(`/en/products/${product.slug}`)
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
        isArchived: false,
      },
      include: {
        cover_img: true,
        drawing_img: true,
        graph_img: true,
        impedance_img: true,
        allCat: true,
        specification: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
