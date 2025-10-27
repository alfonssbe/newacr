import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

export async function GET(req: Request, props: { params: Promise<{ specificationId: string }> }) {
  const params = await props.params;
  try {
    if (!params.specificationId) {
      return new NextResponse("Specification id is required", { status: 400 });
    }

    const specification = await prismadb.specification.findUnique({
      where: {
        id: params.specificationId
      }
    });
    return NextResponse.json(specification);
  } catch (error) {
    console.log('[SPECIFICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  props: { params: Promise<{ productId: string, brandId: string, specificationId: string }> }
) {
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

    const { 
      diameter_speaker,
      daya_maksimum  ,
      lebar_daerah_frekuensi  ,
      spl  ,
      medan_magnet ,
      berat_magnet ,
      voice_coil_diameter  ,
      impedansi ,
      nominal_power_handling ,
      program_power ,
      voice_coil_material ,
      berat_speaker ,
      diameter_throat,
      dc_resistance,
      former_material,
      diaphragm_material,
      bahan_magnet,
      recommended_crossover,
      diameter_cone_efektif,
      custom_note,
      deskripsi_sparepart,
      isi_per_dus_sparepart } = body;

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    
    
    const specification = await prismadb.specification.update({
      where: {
        id : params.specificationId
      },
      data: {
        diameter_speaker,
      daya_maksimum  ,
      lebar_daerah_frekuensi  ,
      spl  ,
      medan_magnet ,
      berat_magnet ,
      voice_coil_diameter  ,
      impedansi ,
      nominal_power_handling ,
      program_power ,
      voice_coil_material ,
      berat_speaker ,
      diameter_throat,
      dc_resistance,
      former_material,
      diaphragm_material,
      bahan_magnet,
      recommended_crossover,
      diameter_cone_efektif,
      custom_note,
      deskripsi_sparepart,
      isi_per_dus_sparepart,
      updatedAt: new Date()
      }
    });

    const updatedProduct = await prismadb.product.update({
      where:{
        id: params.productId
      },
      data: {
        updatedBy: session.name,
        updatedAt: new Date(),
        specId: specification.id
      }
    });
      
    revalidatePath(`/produk/${updatedProduct.slug}`);
    revalidatePath(`/en/products/${updatedProduct.slug}`);
  
    return NextResponse.json(specification);
  } catch (error) {
    console.log('[SPECIFICATION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
