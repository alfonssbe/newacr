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

    const { nameIndo, nameEnglish, unit } = body;

    if (!nameIndo) {
      return new NextResponse("Indo name is required", { status: 400 });
    }
    if (!nameEnglish) {
      return new NextResponse("English name is required", { status: 400 });
    }

    const duplicates = await prismadb.dynamicspecification.findFirst({
      where:{
        nameIndo,
      }
    })
    const duplicatesEng = await prismadb.dynamicspecification.findFirst({
      where:{
        nameEnglish,
      }
    })

    if(duplicates || duplicatesEng){
      return NextResponse.json("duplicate")
    }

    await prismadb.dynamicspecification.create({
      data: {
        nameIndo,
        nameEnglish,
        slugEnglish: slugify(nameEnglish),
        slugIndo: slugify(nameIndo),
        unit,
        updatedBy: session.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[DYNAMIC_CHILD_SPEC_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request) {
  try {

    const childspec = await prismadb.dynamicspecification.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(childspec);
  } catch (error) {
    console.log('[DYNAMIC_CHILD_SPEC_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
