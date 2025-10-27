import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, customProductSlug: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const productId = await prismadb.product.findFirst({
      where: {
        slug: params.customProductSlug
      },
      select: {
        id: true
      }
    })

    if(!productId){
      return new NextResponse("Product not found", { status: 404 });
    }

    const multiple_datasheet = await prismadb.multipleDatasheetProduct.findMany({
      where: {
        productId: productId.id
      }
    });
    return NextResponse.json(multiple_datasheet);
  } catch (error) {
    console.log('[MULTIPLE_DATASHEET_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
  