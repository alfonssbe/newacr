import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  props: { params: Promise<{ hornSpecificationId: string }> }
) {
  const params = await props.params;
  try {
    if (!params.hornSpecificationId) {
      return new NextResponse("Horn Specification id is required", { status: 400 });
    }

    const hornspecification = await prismadb.hornSpecification.findUnique({
      where: {
        id: params.hornSpecificationId
      }
    });
    return NextResponse.json(hornspecification);
  } catch (error) {
    console.log('[HORN_SPECIFICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ productId: string, brandId: string, hornSpecificationId: string }> }
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

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    
    
    const hornspecification = await prismadb.hornSpecification.update({
      where: {
        id : params.hornSpecificationId
      },
      data: {
        diameter_throat,
        ukuran,
        material,
        updatedAt: new Date()
      }
    });

    const updatedproduct = await prismadb.product.update({
      where:{
        id: params.productId
      },
      data: {
        hornSpecId: hornspecification.id,
        updatedBy: session.name,
        updatedAt: new Date()
      }
    });
      
    revalidatePath(`/produk/${updatedproduct.slug}`);
    revalidatePath(`/en/products/${updatedproduct.slug}`);
  
    return NextResponse.json(hornspecification);
  } catch (error) {
    console.log('[HORN_SPECIFICATION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
