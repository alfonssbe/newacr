import prismadb from "@/lib/prismadb";
import { CeilingSpecForm } from "./components/ceiling_specification_form";


const CeilingSpecPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;

  const specCeiling = await prismadb.ceilingSpecification.findFirst({
    where: {
      productId: params.productId,
    },
  });

  const product = await prismadb.product.findFirst({
    where:{
      id: params.productId
    },
    select:{
      name: true
    }
  })

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CeilingSpecForm 
          initialData={specCeiling!}
          product_name={product!.name}
        />
      </div>
    </div>
  );
}

export default CeilingSpecPage;
