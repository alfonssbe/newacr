import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { redirect } from "next/navigation";
import { ChildSpecColumn } from "./components/columns";
import { ChildSpecClient } from "./components/client";
import { getSession } from "@/app/admin/actions";

const ChildSpecPage = async (
) => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const childspec = await prismadb.dynamicspecification.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedChildSpec: ChildSpecColumn[] = childspec.map((item) => ({
    id: item.id,
    nameIndo: item.nameIndo,
    nameEnglish: item.nameEnglish,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ChildSpecClient data={formattedChildSpec}/>
      </div>
    </div>
  );
};

export default ChildSpecPage;
