import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
  ) {
    try {
      const sparepart = await prismadb.product.findMany({
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
              voice_coil_diameter: true,
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
          allCat: {
            some: {
              type: 'Category',
              name: 'Spareparts'
            }
          }
        }
      });
      return NextResponse.json(sparepart);
    } catch (error) {
      console.log('[ALL_SPAREPART_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };