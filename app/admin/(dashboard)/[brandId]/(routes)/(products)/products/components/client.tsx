"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/admin/components/ui/data-table";
import { Heading } from "@/app/admin/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ProductColumn, columns } from "./columns";
import { ToggleGroup, ToggleGroupItem } from "@/app/admin/components/ui/toggle-group";
import React from "react";

interface ProductsClientProps {
  data: ProductColumn[];
  userRole: boolean
};

export const ProductsClient: React.FC<ProductsClientProps> = ({
  data,
  userRole
}) => {
  const [filter, setFilter] = React.useState('all')
  const params = useParams();
  const router = useRouter();
  let sentData: ProductColumn[] = data;
  if(filter === 'all'){
    sentData = data
  }
  else if(filter === 'active'){
    sentData = data.filter(item => item.isArchived === false)
  }
  else if(filter === 'archived'){
    sentData = data.filter(item => item.isArchived === true)
  }
  else if(filter === 'featured'){
    sentData = data.filter(item => item.isFeatured === true)
  }


  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Products (${sentData.length})`} description="Manage products for your brand" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/products/new`)} className="bg-green-500 text-white hover:bg-green-600 transition-colors">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <ToggleGroup type="single">
        <ToggleGroupItem value="all" aria-label="Toggle all"  onClick={() => {
                setFilter("all")
                }}>
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="active" aria-label="Toggle active"  onClick={() => {
                  setFilter("active")
                }}>
          Active
        </ToggleGroupItem>
        <ToggleGroupItem value="archived" aria-label="Toggle archived"  onClick={() => {
                  setFilter("archived")
                }}>
          Archived
        </ToggleGroupItem>
        <ToggleGroupItem value="featured" aria-label="Toggle featured"  onClick={() => {
                  setFilter("featured")
                }}>
          Featured
        </ToggleGroupItem>
      </ToggleGroup>
      <DataTable searchKey="name" columns={columns} data={sentData} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for Products" />
        <Separator />
        <ApiList entityName="products" entityIdName="productId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
