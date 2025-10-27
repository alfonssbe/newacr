"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/admin/components/ui/data-table";
import { Heading } from "@/app/admin/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, HeroColumn } from "./columns";

interface HeroClientProps {
  data: HeroColumn[];
  userRole: boolean
}

export const HeroClient: React.FC<HeroClientProps> = ({
  data,
  userRole
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Hero (${data.length})`} description="Manage Your Hero Section" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/hero/new`)} variant={'secondary'} className="bg-green-500 text-white hover:bg-green-600 transition-colors">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for News" />
        <Separator />
        <ApiList entityName="news" entityIdName="newsId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
