import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  props: { params: Promise<{ thieleSpecificationId: string }> }
) {
  const params = await props.params;
  try {
    if (!params.thieleSpecificationId) {
      return new NextResponse("Thiele Specification id is required", { status: 400 });
    }

    const thielespecification2 = await prismadb.thieleSmallParameters2Ohm.findUnique({
      where: {
        id: params.thieleSpecificationId
      }
    });
    return NextResponse.json(thielespecification2);
  } catch (error) {
    console.log('[SINGLE_THIELE_SPECIFICATION_2_OHM_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ productId: string, brandId: string, thieleSpecificationId: string }> }
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
      fs,
      dcr,
      qts,
      qes,
      qms,
      mms,
      cms,
      bl_product,
      vas,
      no,
      sd,
      x_max } = body;

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    
    
    const thielespecification = await prismadb.thieleSmallParameters2Ohm.update({
      where: {
        id : params.thieleSpecificationId
      },
      data: {
        fs,
      dcr,
      qts,
      qes,
      qms,
      mms,
      cms,
      bl_product,
      vas,
      no,
      sd,
      x_max,
      updatedAt: new Date()
      }
    });

    const updatedProduct = await prismadb.product.update({
      where:{
        id: params.productId
      },
      data: {
        thieleSmallParameter2OhmId: thielespecification.id,
        updatedAt: new Date(),
        updatedBy: session.name,
      }
    });
          
    revalidatePath(`/produk/${updatedProduct.slug}`);
    revalidatePath(`/en/products/${updatedProduct.slug}`);
  
    return NextResponse.json(thielespecification);
  } catch (error) {
    console.log('[SINGLE_THIELE_SPECIFICATION_2_OHM_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
