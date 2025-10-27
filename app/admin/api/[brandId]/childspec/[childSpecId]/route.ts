import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { checkBearerAPI, getSession } from "@/app/admin/actions";

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  return strBeforeSlash.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '');
};

export async function GET(req: Request, props: { params: Promise<{ childSpecId: string }> }) {
  const params = await props.params;
  try {
    if (!params.childSpecId) {
      return new NextResponse("Child Spec id is required", { status: 400 });
    }

    const childspec = await prismadb.dynamicspecification.findUnique({
      where: {
        id: params.childSpecId,
      },
    });
  
    return NextResponse.json(childspec);
  } catch (error) {
    console.log('[SINGLE_DYNAMIC_CHILD_SPEC_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ childSpecId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn){
      return NextResponse.json("expired_session")
    }

    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    if (!params.childSpecId) {
      return new NextResponse("Child Specification id is required", { status: 400 });
    }

    const stillused = await prismadb.specificationconnector.findMany({
      where: {
        dynamicspecificationId: params.childSpecId
      }
    })

    if(stillused.length!=0){
      return NextResponse.json("stillused")
    }

    await prismadb.dynamicspecification.deleteMany({
      where: { 
        id: params.childSpecId
      },
    });

    return NextResponse.json({ message: 'Child Specification deleted successfully' }, { status: 200 });
    
  } catch (error: any) {
    console.error('[SINGLE_DYNAMIC_CHILD_SPEC_DELETE]', error?.message || error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ childSpecId: string }> }
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

    const { nameIndo, nameEnglish, unit } = body;

    if (!params.childSpecId) {
      return new NextResponse("Child Specification id is required", { status: 400 });
    }

    if (!nameIndo) {
      return new NextResponse("Name Indo is required", { status: 400 });
    }

    if (!nameEnglish) {
      return new NextResponse("Name English is required", { status: 400 });
    }

    const initial = await prismadb.dynamicspecification.findFirst({
      where:{
        id: params.childSpecId
      }
    })

    if(initial){
      if(initial.nameIndo ===  nameIndo && initial.nameEnglish === nameEnglish){
        await prismadb.dynamicspecification.update({
          where: {
            id: params.childSpecId
          },
          data: {
            nameIndo,
            nameEnglish,
            slugIndo: slugify(nameIndo),
            slugEnglish: slugify(nameEnglish),
            unit,
            updatedAt: new Date(),
            updatedBy: session.name,
          },
        });

        return NextResponse.json("same")
      }
    }

    const duplicates = await prismadb.dynamicspecification.findFirst({
      where:{
        nameIndo
      }
    })
    const duplicate2 = await prismadb.dynamicspecification.findFirst({
      where:{
        nameEnglish
      }
    })

    if(duplicates || duplicate2){
      return NextResponse.json("duplicate")
    }

    // PRODUCT OVERALL
    await prismadb.dynamicspecification.update({
      where: {
        id: params.childSpecId
      },
      data: {
        nameIndo,
        nameEnglish,
        slugIndo: slugify(nameIndo),
        slugEnglish: slugify(nameEnglish),
        unit,
        updatedAt: new Date(),
        updatedBy: session.name
      },
    });

     
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SINGLE_DYNAMIC_CHILD_SPEC_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};