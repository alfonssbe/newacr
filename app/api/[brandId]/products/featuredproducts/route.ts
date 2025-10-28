import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { allCardFeaturedProduct } from '@/app/utils/filterPageProps';

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    let neededSpec = allCardFeaturedProduct

    const allSpecsNeeded = await prismadb.dynamicspecification.findMany({
      where: {
        slugEnglish: {
          in : neededSpec.map((val) => val)
        }
      },
      select: {
        id: true
      }
    })

    const products = await prismadb.product.findMany({
      where: {
        isArchived: false,
        isFeatured: true
      },
      include: {
        allCat: {
          where: {
            type: {
              in: ['Sub Category', 'Sub Sub Category', 'Series']
            }
          },
          select: {
            name: true,
            slug: true,
            type: true
          }
        },
        cover_img: {
          select: {
            url: true
          }
        },
        size: {
          select: {
            name: true,
            value: true
          }
        },
        connectorSpecifications: {
          where: {
            dynamicspecificationId: {
              in: allSpecsNeeded.map((val) => val.id)
            }
          },
          include: {
            dynamicspecification: {
              select: {
                nameIndo: true,
                slugIndo: true,
                nameEnglish: true,
                slugEnglish: true,
                unit: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[FEATURED_PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
