import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ brandId: string, productSlug: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    if (!params.productSlug) {
      return new NextResponse("Product slug is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
        isArchived: false,
        slug: params.productSlug
      },
      select: {
        slug: true,
        name: true,
        id: true,
        specification: true,
        haveSparepart: true,
        size: {
          select: {
            name: true,
            value: true
          }
        },
        allCat: {
          select: {
            name: true,
            type: true,
          }
        },
        cover_img: {
          select: {
            url: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const productsWithCategoriesandImage = products.map((product) => {
      

      let tempName = ""
      const categoryDetails = product.allCat.map(category => {
          tempName = tempName.concat(category.name, " ");
          return { tempName };
      });
      
      const final_Url = product.cover_img.map(url => ({
       url: url.url
      }));

      const hasValidSize = product.size.value !== '-';
      const seriesName = product.allCat.find(category => category.type === "Series")?.name;
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
    
      const subcatName = product.allCat.find(category => category.type === "Sub Category")?.name;

      return {
        label: product.name,
        value: tempName,
        slug: product.slug,
        url: final_Url,
        categoryDetails: finalDesc,
        spec: product.specification,
        series: seriesName,
        subcat: subcatName,
        haveSparepart: product.haveSparepart
        // description: product.size.value != '-' && product.size.name.toString().concat(" inch ")
        // description: product.size.name != '-' && product.size.value.toString().concat(" inch ", product.sub_sub_categories.length > 0 && product.sub_sub_categories[0].name , product.series.length>0 && " - ", product.series[0].name, " Series")
      };
    });


  
    return NextResponse.json(productsWithCategoriesandImage);
  } catch (error) {
    console.log('[NAVBAR_FEATURED_PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};