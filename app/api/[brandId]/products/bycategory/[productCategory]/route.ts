import { ChildSpecificationProp } from "@/app/types";
import { allproducts } from "@/app/utils/filterPageProps";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, props: { params: Promise<{ productCategory: string }> }
  ) {
    const params = await props.params;
    try {
      if (!params.productCategory) {
        return new NextResponse("Product Category is required", { status: 400 });
      }
      let neededSpec = allproducts
      const allTypes = await prismadb.allCategory.findMany({
        where: {
          type: 'Sub Sub Category'
        },
        select:{
          slug: true
        }
      })
      
      const allBrand = await prismadb.allCategory.findMany({
        where: {
          type: 'Sub Category'
        }
      })
  
      const allSeries = await prismadb.allCategory.findMany({
        where: {
          type: 'Series'
        }
      })

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

      // if(params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID) {     
      const products = await prismadb.product.findMany({
        where: {
          isArchived: false,
          allCat: {
            some: {
              type: 'Category',
              slug: params.productCategory === 'drivers' || params.productCategory === 'driver' ? 'drivers' : 'spareparts'
            }
          },
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

      let allSpecsCombined: Record<string, ChildSpecificationProp[]> = {}
      neededSpec.forEach((specParent) => {
        const matchingSpecs: ChildSpecificationProp[] = []
        
        if(specParent === 'type'){
          products.forEach((prod) => {
            prod.allCat.map((subprod) => {
              if(subprod.type === 'Sub Sub Category'){
                const found = allTypes.find((val) => val.slug === subprod.slug)
                found && matchingSpecs.push({
                  childnameEnglish: "Type",
                  childnameIndo: "Tipe",
                  value: subprod.name,
                  notes: '',
                  slugEnglish: 'type',
                  slugIndo: 'tipe',
                  unit: ''
                })
              }
            })
          })
        }
        else if(specParent === 'series'){
          products.forEach((prod) => {
            prod.allCat.map((subprod) => {
              if(subprod.type === 'Sub Category'){
                const found = allBrand.find((val) => val.slug === subprod.slug)
                found && matchingSpecs.push({
                  childnameEnglish: "Series",
                  childnameIndo: "Seri",
                  value: subprod.name,
                  notes: '',
                  slugEnglish: 'series',
                  slugIndo: 'seri',
                  unit: ''
                })
              }
            })
          })
        }
        else if(specParent === 'acr-series'){
          products.forEach((prod) => {
            prod.allCat.map((subprod) => {
              if(subprod.type === 'Series'){
                const found = allSeries.find((val) => val.slug === subprod.slug)
                found && matchingSpecs.push({
                  childnameEnglish: "ACR series",
                  childnameIndo: "Seri ACR",
                  value: subprod.name,
                  notes: '',
                  slugEnglish: 'acr-series',
                  slugIndo: 'seri-acr',
                  unit: ''
                })
              }
            })
          })
        }
        else{
          products.forEach((prod) => {
            prod.connectorSpecifications.forEach((spec) => {
              if (spec.dynamicspecification.slugEnglish === specParent) {
                matchingSpecs.push({
                  childnameEnglish: spec.dynamicspecification.nameEnglish,
                  childnameIndo: spec.dynamicspecification.nameIndo,
                  value: spec.value,
                  notes: spec.notes,
                  slugEnglish: spec.dynamicspecification.slugEnglish,
                  slugIndo: spec.dynamicspecification.slugIndo,
                  unit: spec.dynamicspecification.unit
                })
              }
            })
          })
        }

        allSpecsCombined[specParent] = matchingSpecs
      })
      
      return NextResponse.json({
        products,
        allSpecsCombined
      });
    } catch (error) {
      console.log('[ALL_PRODUCT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };