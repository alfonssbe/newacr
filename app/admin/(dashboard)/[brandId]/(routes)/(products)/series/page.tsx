import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { SeriesColumn } from "./components/columns";
import { SeriesClient } from "./components/client";
import { getSession } from "@/app/admin/actions";
import { redirect } from "next/navigation";

const SeriesPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const series = await prismadb.allCategory.findMany({
    where: {
      brandId: params.brandId,
      type: "Series"
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSeries: SeriesColumn[] = series.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    updatedBy: item.updatedBy,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SeriesClient data={formattedSeries} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default SeriesPage;
