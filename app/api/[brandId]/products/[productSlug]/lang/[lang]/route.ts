import { ChildSpecificationProp, SpecificationProp } from "@/app/types";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ lang: string, productSlug: string }> }) {
  const params = await props.params;
  try {
    if (!params.productSlug) {
      return new NextResponse("Product slug is required", { status: 400 });
    }
    const product = await prismadb.product.findFirst({
      where: {
        slug: params.productSlug,
        isArchived: false
      },
      include: {
        allCat: true,
        images_catalogues: true,
        drawing_img: true,
        graph_img: true,
        impedance_img: true,
        cover_img: true,
        size: true,
        multipleDatasheetProduct: true,
        connectorSpecifications: {
          include: {
            dynamicspecification: true,
            dynamicspecificationParent: true,
            dynamicspecificationSubParent: true
          }
        }
      }
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const specsCombined = (product?.connectorSpecifications ?? []).reduce<SpecificationProp[]>(
        (acc, connector) => {
          const parentname = params.lang === 'en' ? connector.dynamicspecificationParent?.nameEnglish ?? "" : connector.dynamicspecificationParent?.nameIndo ?? "";
          const subparentname = params.lang === 'en' ? connector.dynamicspecificationSubParent?.nameEnglish ?? "": connector.dynamicspecificationSubParent?.nameIndo ?? "";

          const child: ChildSpecificationProp = {
            childnameEnglish: connector.dynamicspecification?.nameEnglish ?? "",
            childnameIndo: connector.dynamicspecification?.nameIndo ?? "",
            value: connector.value ?? "",
            notes: connector.notes ?? "",
            slugEnglish: connector.dynamicspecification?.slugEnglish ?? "",
            slugIndo : connector.dynamicspecification?.slugIndo ?? "",
            unit: connector.dynamicspecification?.unit ?? "",
          };

          const existingGroup = acc.find(
            (group) =>
              group.parentname === parentname &&
              group.subparentname === subparentname
          );

          if (existingGroup) {
            existingGroup.child.push(child);
          } else {
            acc.push({ parentname, subparentname, child: [child] });
          }

          return acc;
        },
        []
      );

      // ✅ Build lookup maps for faster access
      const parentPriorityMap = new Map(
        product?.connectorSpecifications.map((c) => [
          params.lang === 'en' ? c.dynamicspecificationParent?.nameEnglish ?? "" : c.dynamicspecificationParent?.nameIndo ?? "",
          c.dynamicspecificationParent?.priority ?? 0,
        ])
      );

      const subParentPriorityMap = new Map(
        product?.connectorSpecifications.map((c) => [
          params.lang === 'en' ? c.dynamicspecificationSubParent?.nameEnglish ?? "" : c.dynamicspecificationSubParent?.nameIndo ?? "",
          c.dynamicspecificationSubParent?.priority ?? 0,
        ])
      );

      const childPriorityMap = new Map(
        product?.connectorSpecifications.map((c) => [
          params.lang === 'en' ? c.dynamicspecification?.nameEnglish ?? "" : c.dynamicspecification?.nameIndo ?? "",
          c.dynamicspecification?.priority ?? 0,
        ])
      );

      // ✅ Sort parent/subparent groups by priority
      specsCombined.sort((a, b) => {
        const aParentPriority = Number(parentPriorityMap.get(a.parentname)) ?? 0;
        const bParentPriority = Number(parentPriorityMap.get(b.parentname)) ?? 0;
        if (aParentPriority !== bParentPriority)
          return aParentPriority - bParentPriority;

        const aSubPriority = Number(subParentPriorityMap.get(a.subparentname)) ?? 0;
        const bSubPriority = Number(subParentPriorityMap.get(b.subparentname)) ?? 0;
        if (aSubPriority !== bSubPriority)
          return aSubPriority - bSubPriority;

        return 0;
      });

      // ✅ Sort children inside each group by their own priority
      specsCombined.forEach((group) => {
        group.child.sort((a, b) => {
          const aPriority = Number(childPriorityMap.get(params.lang === 'en' ? a.childnameEnglish : a.childnameIndo)) ?? 0;
          const bPriority = Number(childPriorityMap.get(params.lang === 'en' ? b.childnameEnglish : b.childnameIndo)) ?? 0;
          return aPriority - bPriority;
        });
      });

    const responseData = {
      product,
      specifications: specsCombined
    };


    return NextResponse.json(responseData);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
