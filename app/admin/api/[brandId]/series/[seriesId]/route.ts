import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

const slugify = (str: string): string => str.toLowerCase()
.replace(/\+/g, 'plus')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');

export async function GET(req: Request, props: { params: Promise<{ seriesId: string }> }) {
  const params = await props.params;
  try {
    if (!params.seriesId) {
      return new NextResponse("Series id is required", { status: 400 });
    }

    const series = await prismadb.allCategory.findUnique({
      where: {
        id: params.seriesId,
        type: "Series"
      }
    });
  
    return NextResponse.json(series);
  } catch (error) {
    console.log('[SERIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ seriesId: string, brandId: string }> }
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

    if (!params.seriesId) {
      return new NextResponse("Series id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const stillused = await prismadb.allProductCategory.findMany({
      where:{
        categoryId: params.seriesId,
        type: "Series"
      }
    })

    if(stillused.length!=0){
      return NextResponse.json("stillused")
    }

    const series_duplicate = await prismadb.allProductCategory.findMany({
      where:{
        categoryId: params.seriesId
      },
      select:{
        slug: true,
        productId: true
      }
    })

    
    await prismadb.allCategory.deleteMany({
      where: {
        id: params.seriesId
      }
    });

    const series = Array.from(
      new Map(series_duplicate.map((item) => [item.slug, item])).values()
    );
    const prod = await prismadb.product.findMany({
      where: {
        id : {
          in: series.map((s)=> s.productId)
        }
      },
      select: {
        slug: true
      }
    })
    prod && prod.length > 0 && prod.map((product) => {
      revalidatePath(`/produk/${product.slug}`);
      revalidatePath(`/en/products/${product.slug}`);
    })
    if(series){
      const subsubcat_dup = await prismadb.allProductCategory.findMany({
        where:{
          productId: {
            in: series.map((s) => s.productId),
          },
          type:"Sub Sub Category"
        },
        select:{
          slug: true
        }
      })
      const subsubcat = Array.from(
        new Map(subsubcat_dup.map((item) => [item.slug, item])).values()
      );
      const subcat_dup = await prismadb.allProductCategory.findMany({
        where:{
          productId: {
            in: series.map((s) => s.productId),
          },
          type:"Sub Category"
        },
        select:{
          slug: true
        }
      })
      const subcat = Array.from(
        new Map(subcat_dup.map((item) => [item.slug, item])).values()
      );
      const cat_dup = await prismadb.allProductCategory.findMany({
        where:{
          productId: {
            in: series.map((s) => s.productId),
          },
          type:"Category"
        },
        select:{
          slug: true
        }
      })
      const cat = Array.from(
        new Map(cat_dup.map((item) => [item.slug, item])).values()
      );
      cat && cat.map((category) => {
        subcat && subcat.map((subcategory) => {
          series && series.map((subseries)=> {
          revalidatePath(`/${category.slug}/${subcategory.slug}/${subseries.slug}`);
          revalidatePath(`/en/${category.slug}/${subcategory.slug}/${subseries.slug}`);
          subsubcat && subsubcat.map((subsubcategory)=> {
            revalidatePath(`/${category.slug}/${subcategory.slug}/${subseries.slug}/${subsubcategory.slug}`);
            revalidatePath(`/en/${category.slug}/${subcategory.slug}/${subseries.slug}/${subsubcategory.slug}`);
          })
        })
        })
        series && series.map((subseries)=> {
          revalidatePath(`/${category.slug}/${subseries.slug}`);
          revalidatePath(`/en/${category.slug}/${subseries.slug}`);
        })
      })
    }
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SERIES_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ seriesId: string, brandId: string }> }
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

    const { type, name, description } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.seriesId) {
      return new NextResponse("Series id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const initial = await prismadb.allCategory.findFirst({
      where:{
        id: params.seriesId,
        brandId: params.brandId
      },
      select:{
        name: true
      }
    })

    if(initial){
      if(initial.name ===  name){
        await prismadb.allCategory.update({
          where: {
            id: params.seriesId
          },
          data: {
            type: type,
            name: name,
            slug: slugify(name),
            description: description,
            thumbnail_url: "",
            updatedAt: new Date(),
            updatedBy: session.name,
          }
        });

        await prismadb.allProductCategory.updateMany({
          where: {
            categoryId: params.seriesId,
            type
          },
          data:{
            name,
            updatedAt: new Date(),
            slug: slugify(name)
          }
        })

        const series_duplicate = await prismadb.allProductCategory.findMany({
          where:{
            categoryId: params.seriesId
          },
          select:{
            slug: true,
            productId: true
          }
        })
        const series = Array.from(
          new Map(series_duplicate.map((item) => [item.slug, item])).values()
        );
        const prod = await prismadb.product.findMany({
          where: {
            id : {
              in: series.map((s)=> s.productId)
            }
          },
          select: {
            slug: true
          }
        })
        prod && prod.length > 0 && prod.map((product) => {
          revalidatePath(`/produk/${product.slug}`);
          revalidatePath(`/en/products/${product.slug}`);
        })
        if(series){
          const subsubcat_dup = await prismadb.allProductCategory.findMany({
            where:{
              productId: {
                in: series.map((s) => s.productId),
              },
              type:"Sub Sub Category"
            },
            select:{
              slug: true
            }
          })
          const subsubcat = Array.from(
            new Map(subsubcat_dup.map((item) => [item.slug, item])).values()
          );
          const subcat_dup = await prismadb.allProductCategory.findMany({
            where:{
              productId: {
                in: series.map((s) => s.productId),
              },
              type:"Sub Category"
            },
            select:{
              slug: true
            }
          })
          const subcat = Array.from(
            new Map(subcat_dup.map((item) => [item.slug, item])).values()
          );
          const cat_dup = await prismadb.allProductCategory.findMany({
            where:{
              productId: {
                in: series.map((s) => s.productId),
              },
              type:"Category"
            },
            select:{
              slug: true
            }
          })
          const cat = Array.from(
            new Map(cat_dup.map((item) => [item.slug, item])).values()
          );
          cat && cat.map((category) => {
            subcat && subcat.map((subcategory) => {
              series && series.map((subseries)=> {
              revalidatePath(`/${category.slug}/${subcategory.slug}/${subseries.slug}`);
              revalidatePath(`/en/${category.slug}/${subcategory.slug}/${subseries.slug}`);
              subsubcat && subsubcat.map((subsubcategory)=> {
                revalidatePath(`/${category.slug}/${subcategory.slug}/${subseries.slug}/${subsubcategory.slug}`);
                revalidatePath(`/en/${category.slug}/${subcategory.slug}/${subseries.slug}/${subsubcategory.slug}`);
              })
            })
            })
            series && series.map((subseries)=> {
              revalidatePath(`/${category.slug}/${subseries.slug}`);
              revalidatePath(`/en/${category.slug}/${subseries.slug}`);
            })
          })
        }

        return NextResponse.json("same")
      }
    }

    const duplicates = await prismadb.allCategory.findFirst({
      where:{
        name,
        type,
        brandId: params.brandId
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    await prismadb.allCategory.update({
      where: {
        id: params.seriesId
      },
      data: {
        type: type,
        name: name,
        slug: slugify(name),
        description: description,
        thumbnail_url: "",
        updatedAt: new Date(),
        updatedBy: session.name,
      }
    });
    await prismadb.allProductCategory.updateMany({
      where: {
        categoryId: params.seriesId,
        type
      },
      data:{
        name,
        updatedAt: new Date(),
        slug: slugify(name)
      }
    })

   
    const series_duplicate = await prismadb.allProductCategory.findMany({
      where:{
        categoryId: params.seriesId
      },
      select:{
        slug: true,
        productId: true
      }
    })
    const series = Array.from(
      new Map(series_duplicate.map((item) => [item.slug, item])).values()
    );
    const prod = await prismadb.product.findMany({
      where: {
        id : {
          in: series.map((s)=> s.productId)
        }
      },
      select: {
        slug: true
      }
    })
    prod && prod.length > 0 && prod.map((product) => {
      revalidatePath(`/produk/${product.slug}`);
      revalidatePath(`/en/products/${product.slug}`);
    })
    if(series){
      const subsubcat_dup = await prismadb.allProductCategory.findMany({
        where:{
          productId: {
            in: series.map((s) => s.productId),
          },
          type:"Sub Sub Category"
        },
        select:{
          slug: true
        }
      })
      const subsubcat = Array.from(
        new Map(subsubcat_dup.map((item) => [item.slug, item])).values()
      );
      const subcat_dup = await prismadb.allProductCategory.findMany({
        where:{
          productId: {
            in: series.map((s) => s.productId),
          },
          type:"Sub Category"
        },
        select:{
          slug: true
        }
      })
      const subcat = Array.from(
        new Map(subcat_dup.map((item) => [item.slug, item])).values()
      );
      const cat_dup = await prismadb.allProductCategory.findMany({
        where:{
          productId: {
            in: series.map((s) => s.productId),
          },
          type:"Category"
        },
        select:{
          slug: true
        }
      })
      const cat = Array.from(
        new Map(cat_dup.map((item) => [item.slug, item])).values()
      );
      cat && cat.map((category) => {
        subcat && subcat.map((subcategory) => {
          series && series.map((subseries)=> {
          revalidatePath(`/${category.slug}/${subcategory.slug}/${subseries.slug}`);
          revalidatePath(`/en/${category.slug}/${subcategory.slug}/${subseries.slug}`);
          subsubcat && subsubcat.map((subsubcategory)=> {
            revalidatePath(`/${category.slug}/${subcategory.slug}/${subseries.slug}/${subsubcategory.slug}`);
            revalidatePath(`/en/${category.slug}/${subcategory.slug}/${subseries.slug}/${subsubcategory.slug}`);
          })
        })
        })
        series && series.map((subseries)=> {
          revalidatePath(`/${category.slug}/${subseries.slug}`);
          revalidatePath(`/en/${category.slug}/${subseries.slug}`);
        })
      })
    }

  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SERIES_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
