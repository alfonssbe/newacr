import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { navbarFeaturedProduct } from '@/app/utils/filterPageProps';
import { ChildSpecificationProp, NavbarFeaturedProduct } from '@/app/types';

export async function GET(req: Request, props: { params: Promise<{ brandId: string, productSlug: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    if (!params.productSlug) {
      return new NextResponse("Product slug is required", { status: 400 });
    }

    let neededSpec = navbarFeaturedProduct
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

    const product = await prismadb.product.findFirst({
      where: {
        brandId: params.brandId,
        isArchived: false,
        slug: params.productSlug
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
          },
          orderBy : {
            dynamicspecificationId: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    if(product){      
      const final_Url = product.cover_img.map(url => ({
       url: url.url
      }));

      const hasValidSize = product.size.value !== '-';
      const seriesName = product.allCat.find(category => category.type === "Series")?.name ?? '';
      let finalDesc = '';
      if (hasValidSize) {
        finalDesc += `${product.size.name} inch`;
      }
      if (hasValidSize && seriesName) {
        finalDesc += ' - ';
      }
      if (seriesName) {
        finalDesc += `${seriesName} Series`;
      }
    
      const subcatName = product.allCat.find(category => category.type === "Sub Category")?.name ?? '';
      const normalizedStr = product.name.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, ' inch');

      let tempSpec: ChildSpecificationProp[] = []
      product.connectorSpecifications.map((oneSpec) => {
        let tempOneSpec: ChildSpecificationProp = {
          childnameIndo: oneSpec.dynamicspecification.nameIndo,
          childnameEnglish: oneSpec.dynamicspecification.nameEnglish,
          value: oneSpec.value,
          slugIndo: oneSpec.dynamicspecification.slugIndo,
          slugEnglish: oneSpec.dynamicspecification.slugEnglish,
          notes: oneSpec.notes,
          unit: oneSpec.dynamicspecification.unit,
        }
        tempSpec.push(tempOneSpec)
      })

      let finalFeatured: NavbarFeaturedProduct = {
        label: product.name,
        value: normalizedStr,
        slug: product.slug,
        url: final_Url[0].url,
        categoryDetails: finalDesc,
        spec: tempSpec,
        series: seriesName,
        subcat: subcatName,
        haveSparepart: product.haveSparepart
      }

      return NextResponse.json(finalFeatured);
    }

  
    return NextResponse.json(null);
  } catch (error) {
    console.log('[NAVBAR_FEATURED_PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};