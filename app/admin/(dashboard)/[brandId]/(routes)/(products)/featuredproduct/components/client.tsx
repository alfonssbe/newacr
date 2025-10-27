"use client";

import { useParams, useRouter } from "next/navigation";

import { DataTable } from "@/app/admin/components/ui/data-table";
import { Heading } from "@/app/admin/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, FeaturedProductColumn } from "./columns";

interface FeaturedProductClientProps {
  data: FeaturedProductColumn[];
  userRole: boolean
}

export const FeaturedProductClient: React.FC<FeaturedProductClientProps> = ({
  data,
  userRole
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Featured Products (${data.length})`} description="Manage Background Picture for Your Featured Products" />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for Featured Products" />
        <Separator />
        <ApiList entityName="featuredproducts" entityIdName="featuredProductId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
