import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/settings-form";
import { getSession } from "@/app/admin/actions";

const SettingsPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const brand = await prismadb.brand.findFirst({
    where: {
      id: params.brandId,
      userId: session.userId
    }
  });

  if (!brand) {
    redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
  }

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={brand} />
      </div>
    </div>
  );
}

export default SettingsPage;
