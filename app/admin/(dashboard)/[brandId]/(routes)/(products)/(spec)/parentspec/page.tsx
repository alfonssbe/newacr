import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { redirect } from "next/navigation";
import { ParentSpecColumn } from "./components/columns";
import { ParentSpecClient } from "./components/client";
import { getSession } from "@/app/admin/actions";

const ParentSpecPage = async (
) => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const parentspec = await prismadb.dynamicspecificationparent.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedParentSpec: ParentSpecColumn[] = parentspec.map((item) => ({
    id: item.id,
    nameIndo: item.nameIndo,
    nameEnglish: item.nameEnglish,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ParentSpecClient data={formattedParentSpec}/>
      </div>
    </div>
  );
};

export default ParentSpecPage;
