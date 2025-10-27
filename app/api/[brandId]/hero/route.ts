import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const hero = await prismadb.hero.findMany({
      include: {
        hero_img: true
      }
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.log('[HERO_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
