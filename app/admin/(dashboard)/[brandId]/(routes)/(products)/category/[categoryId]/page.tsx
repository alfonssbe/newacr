import prismadb from "@/lib/prismadb";

import { CategoryForm } from "./components/category-form";

const CategoryPage = async (
  props: {
    params: Promise<{ categoryId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const category = await prismadb.allCategory.findUnique({
    where: {
      id: params.categoryId,
      type: "Category"
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;
