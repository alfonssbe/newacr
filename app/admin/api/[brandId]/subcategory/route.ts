import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/app/admin/actions';
import { redirect } from 'next/navigation';
 
const slugify = (str: string): string => str.toLowerCase()
.replace(/\+/g, 'plus')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');

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

    const { name, description, type } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized")
    }    

    const duplicates = await prismadb.allCategory.findFirst({
      where:{
        brandId: params.brandId,
        name,
        type
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    await prismadb.allCategory.create({
      data: {
        name: name,
        description: description,
        brandId: params.brandId,
        type: type,
        slug: slugify(name),
        thumbnail_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: session.name,
      }
    });
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SUB_CATEGORY_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const subcategories = await prismadb.allCategory.findMany({
      where: {
        brandId: params.brandId,
        type: "Sub Category"
      }
    });
  
    return NextResponse.json(subcategories);
  } catch (error) {
    console.log('[SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};