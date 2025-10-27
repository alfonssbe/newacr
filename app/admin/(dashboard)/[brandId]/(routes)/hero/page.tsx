import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { getSession } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import { HeroClient } from "./components/client";
import { HeroColumn } from "./components/columns";

const HeroPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const allHero = await prismadb.hero.findMany({
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      hero_img: true
    }
  });

  const formattedHero: HeroColumn[] = allHero.map((item) => ({
    id: item.id,
    name: item.nameEnglish,
    value: item.hero_img.length!=0?item.hero_img[0].url:"",
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HeroClient data={formattedHero} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default HeroPage;
