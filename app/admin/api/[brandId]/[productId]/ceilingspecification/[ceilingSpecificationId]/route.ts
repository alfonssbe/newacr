import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  props: { params: Promise<{ ceilingSpecificationId: string }> }
) {
  const params = await props.params;
  try {
    if (!params.ceilingSpecificationId) {
      return new NextResponse("Ceiling Specification id is required", { status: 400 });
    }

    const ceilingspecification = await prismadb.ceilingSpecification.findUnique({
      where: {
        id: params.ceilingSpecificationId
      }
    });
    return NextResponse.json(ceilingspecification);
  } catch (error) {
    console.log('[CEILING_SPECIFICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ productId: string, brandId: string, ceilingSpecificationId: string }> }
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
      model,
      type,
      input,
      rated_impedance,
      sensitivity,
      frequency_response,
      line_voltage,
      speaker_component,
      weight,
      material,
      accessory,
      rated_power
    } = body;

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    
    
    const ceilingspecification = await prismadb.ceilingSpecification.update({
      where: {
        id : params.ceilingSpecificationId
      },
      data: {
        model,
        type,
        input,
        rated_impedance,
        sensitivity,
        frequency_response,
        line_voltage,
        speaker_component,
        weight,
        material,
        accessory,
        rated_power,
        updatedAt: new Date()
      }
    });

    const updatedproduct = await prismadb.product.update({
      where:{
        id: params.productId
      },
      data: {
        ceilingSpecId: ceilingspecification.id,
        updatedAt: new Date(),
        updatedBy: session.name,
      }
    });
      
    revalidatePath(`/produk/${updatedproduct.slug}`);
    revalidatePath(`/en/products/${updatedproduct.slug}`);
  
    return NextResponse.json(ceilingspecification);
  } catch (error) {
    console.log('[CEILING_SPECIFICATION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
