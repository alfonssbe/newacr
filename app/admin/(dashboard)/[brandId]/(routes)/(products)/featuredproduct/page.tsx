import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { getSession } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import { FeaturedProductColumn } from "./components/columns";
import { FeaturedProductClient } from "./components/client";

const FeaturedProductPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const featured = await prismadb.product.findMany({
    where: {
      isFeatured: true,
      brandId: params.brandId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include:{
      featured_img: true
    }
  });

  const formattedFeaturedProduct: FeaturedProductColumn[] = featured.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.featured_img.length!=0?item.featured_img[0].url:"",
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FeaturedProductClient data={formattedFeaturedProduct} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default FeaturedProductPage;
