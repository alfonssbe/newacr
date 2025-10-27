import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/app/admin/actions';
import { revalidatePath } from 'next/cache';
 
export async function POST(
  req: Request,
  props: { params: Promise<{ brandId: string, productId: string }> }
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
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }
    
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const ceilingspecification = await prismadb.ceilingSpecification.create({
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
        productId: params.productId,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    });

    const updatedProduct = await prismadb.product.update({
      where:{
        id: params.productId
      },
      data: {
        ceilingSpecId: ceilingspecification.id,
        updatedBy: session.name,
        updatedAt: new Date()
      }
    });
    
    revalidatePath(`/produk/${updatedProduct.slug}`);
    revalidatePath(`/en/products/${updatedProduct.slug}`);

    return NextResponse.json({ceilingspecification, updatedProduct});
  } catch (error) {
    console.log('[CEILING_SPECIFICATION_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, productId: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const ceilingspecification = await prismadb.ceilingSpecification.findMany({
      where: {
        productId: params.productId
      }
    });
    return NextResponse.json(ceilingspecification);
  } catch (error) {
    console.log('[CEILING_SPECIFICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
