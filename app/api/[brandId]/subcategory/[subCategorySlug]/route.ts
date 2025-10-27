import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, subCategorySlug: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    
    if (!params.subCategorySlug) {
      return new NextResponse("Sub Category Slug is required", { status: 400 });
    }

    const subcategories = await prismadb.allCategory.findFirst({
      where: {
        brandId: params.brandId,
        slug: params.subCategorySlug,
        type: params.subCategorySlug === "acr" || params.subCategorySlug === "desibel" || params.subCategorySlug === "curve" ? "Sub Category" : "Sub Sub Category"
      },
      select:{
        name: true,
        description: true
      }
    });
  
    return NextResponse.json(subcategories);
  } catch (error) {
    console.log('[SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};