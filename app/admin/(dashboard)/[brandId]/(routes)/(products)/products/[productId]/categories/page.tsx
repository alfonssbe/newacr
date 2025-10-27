import prismadb from "@/lib/prismadb";
import { AllProductCategoryForm } from "./components/categories-form";


const AllProductCategoryPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const categories = await prismadb.allCategory.findMany({
    where: {
      type: "Category",
      brandId : params.brandId
    },
  });

  const subcategories = await prismadb.allCategory.findMany({
    where: {
      type: "Sub Category",
      brandId : params.brandId
    },
  });

  const subsubcategories = await prismadb.allCategory.findMany({
    where: {
      type: "Sub Sub Category",
      brandId : params.brandId
    },
  });

  const series = await prismadb.allCategory.findMany({
    where: {
      type: "Series",
      brandId : params.brandId
    },
  });

  const allproductcategories = await prismadb.allProductCategory.findMany({
    where: {
      productId: params.productId,
    },
  });

  const myproduct = await prismadb.product.findFirst({
    where: {
      id: params.productId,
    },
  });
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {myproduct &&
          <AllProductCategoryForm 
            initialData={allproductcategories}
            categories={categories}
            subcategories={subcategories}
            subsubcategories={subsubcategories}
            series={series}
            myproduct={myproduct}
          />
        }
      </div>
    </div>
  );
}

export default AllProductCategoryPage;
