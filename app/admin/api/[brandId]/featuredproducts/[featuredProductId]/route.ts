import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/app/admin/actions';
import { Featured_Image } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, featuredProductId: string }> }
) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
        isFeatured: true,
        isArchived: false,
        id: params.featuredProductId
      },
      include: {
        cover_img: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[SINGLE_FEATURED_PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ featuredProductId: string, brandId: string }> }
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

    const { featured_img, isFeatured, featuredDesc } = body;

    if (!params.featuredProductId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    await prismadb.product.update({
      where: {
        id: params.featuredProductId
      },
      data: {
        isFeatured,
        featuredDesc,
        updatedAt: new Date(),
        updatedBy: session.name,
        featured_img:{
          deleteMany: {},
        }
      },
    })

    if(featured_img.length!=0){
      featured_img.map(async (value: Featured_Image) => {
        if(value.url!=''){
          await prismadb.featured_Image.create({
            data:{
              productId: params.featuredProductId,
              url:value.url,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    revalidatePath('')
    revalidatePath('/en')
    return NextResponse.json("success");
  } catch (error) {
    console.log('[FEATURED_PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
  