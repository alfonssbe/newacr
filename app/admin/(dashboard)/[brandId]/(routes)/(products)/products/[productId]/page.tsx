import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images_catalogues: true,
      cover_img: true,
      drawing_img: true,
      graph_img: true,
      impedance_img: true,
      multipleDatasheetProduct: true,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      brandId: params.brandId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          initialData={product}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default ProductPage;
