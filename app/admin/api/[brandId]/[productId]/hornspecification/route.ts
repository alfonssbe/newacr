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
      diameter_throat,
      ukuran,
      material
    } = body;
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }
    
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const hornspecification = await prismadb.hornSpecification.create({
      data: {
        diameter_throat,
        ukuran,
        material,
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
        hornSpecId: hornspecification.id,
        updatedBy: session.name,
        updatedAt: new Date()
      }
    });
      
    revalidatePath(`/produk/${updatedProduct.slug}`);
    revalidatePath(`/en/products/${updatedProduct.slug}`);

    return NextResponse.json({hornspecification, updatedProduct});
  } catch (error) {
    console.log('[HORN_SPECIFICATION_POST]', error);
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

    const hornspecification = await prismadb.hornSpecification.findMany({
      where: {
        productId: params.productId
      }
    });
    return NextResponse.json(hornspecification);
  } catch (error) {
    console.log('[HORN_SPECIFICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
