import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        allCat: {
          select:{
            type: true,
            id: true,
            name: true,
            slug: true
          }
        },
        specification: {
          select: {
            spl: true,
            impedansi: true,
            program_power: true,
          }
        },
        cover_img: {
          select: {
            url: true
          }
        },
        size: {
          select: {
            value: true,
            name: true
          }
        },
      },
      where:{
        isArchived: false,
        brandId: params.brandId,
        isFeatured: true
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[FEATURED_PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
