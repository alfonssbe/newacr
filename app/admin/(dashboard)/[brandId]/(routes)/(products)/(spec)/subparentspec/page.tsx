import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { redirect } from "next/navigation";
import { SubParentSpecColumn } from "./components/columns";
import { SubParentSpecClient } from "./components/client";
import { getSession } from "@/app/admin/actions";

const SubParentSpecPage = async (
) => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const subparentspec = await prismadb.dynamicspecificationsubparent.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedSubParentSpec: SubParentSpecColumn[] = subparentspec.map((item) => ({
    id: item.id,
    nameIndo: item.nameIndo,
    nameEnglish: item.nameEnglish,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubParentSpecClient data={formattedSubParentSpec}/>
      </div>
    </div>
  );
};

export default SubParentSpecPage;
