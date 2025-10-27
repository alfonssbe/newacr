"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";


import { ChildSpecColumn, columns } from "./columns";
import React from "react";
import { Heading } from "@/app/admin/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/app/admin/components/ui/data-table";

interface ChildSpecClientProps {
  data: ChildSpecColumn[];
};

export const ChildSpecClient: React.FC<ChildSpecClientProps> = ({
  data,
}) => {
  const params = useParams();
  const router = useRouter();
  let sentData: ChildSpecColumn[] = data;


  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Child Specifications (${sentData.length})`} description="Manage Child Specifications" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/childspec/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nameIndo" columns={columns} data={sentData} />
    </>
  );
};
