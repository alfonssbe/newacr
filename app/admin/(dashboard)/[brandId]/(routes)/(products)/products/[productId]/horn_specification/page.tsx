import prismadb from "@/lib/prismadb";
import { HornSpecForm } from "./components/horn_specification_form";


const HornSpecPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;

  const specHorn = await prismadb.hornSpecification.findFirst({
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
        <HornSpecForm 
          initialData={specHorn!}
          product_name={product!.name}
        />
      </div>
    </div>
  );
}

export default HornSpecPage;
