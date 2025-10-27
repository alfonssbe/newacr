"use client";

import { ApiAlert } from "@/app/admin/components/ui/api-alert";
import { useOrigin } from "@/app/admin/hooks/use-origin";
import { useParams } from "next/navigation";

interface CustomApiListProps {
  entityName: string;
  entityIdName: string;
}

export const CustomApiList: React.FC<CustomApiListProps> = ({
  entityName,
  entityIdName,
}) => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}`;

  return (
    <>
      <ApiAlert title="GET SEARCHBOX" variant="public" description={`${baseUrl}/${entityName}`} />
    </>
  );
};
