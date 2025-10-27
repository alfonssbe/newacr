"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/admin/components/ui/data-table";
import { Heading } from "@/app/admin/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { SubCategoryColumn, columns } from "./columns";

interface SubCategoriesClientProps {
  data: SubCategoryColumn[];
  userRole: boolean;
}

export const SubCategoriesClient: React.FC<SubCategoriesClientProps> = ({
  data,
  userRole
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Sub Category (${data.length})`} description="Manage Sub Category for your products" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subcategory/new`)} variant={'secondary'} className="bg-green-500 text-white hover:bg-green-600 transition-colors">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for Sub Category" />
        <Separator />
        <ApiList entityName="subcategory" entityIdName="subCategoryId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
