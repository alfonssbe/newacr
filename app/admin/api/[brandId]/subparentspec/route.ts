import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkBearerAPI, getSession } from '@/app/admin/actions';

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  return strBeforeSlash.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '');
};

export async function POST(req: Request) {
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

    const { nameIndo, nameEnglish } = body;

    if (!nameIndo) {
      return new NextResponse("Name (Indo) is required", { status: 400 });
    }
    if (!nameEnglish) {
      return new NextResponse("Name (English) is required", { status: 400 });
    }

    const duplicates = await prismadb.dynamicspecificationsubparent.findFirst({
      where:{
        nameIndo,
      }
    })
    const duplicates2 = await prismadb.dynamicspecificationsubparent.findFirst({
      where:{
        nameEnglish,
      }
    })

    if(duplicates || duplicates2){
      return NextResponse.json("duplicate")
    }

    await prismadb.dynamicspecificationsubparent.create({
      data: {
        nameIndo,
        nameEnglish,
        slugIndo: slugify(nameIndo),
        slugEnglish: slugify(nameEnglish),
        updatedBy: session.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[DYNAMIC_SUB_PARENT_SPEC_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request) {
  try {

    const subparentspec = await prismadb.dynamicspecificationsubparent.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(subparentspec);
  } catch (error) {
    console.log('[DYNAMIC_SUB_PARENT_SPEC_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
