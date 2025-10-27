"use client"

import axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/app/admin/components/ui/heading"
import { Label } from "@/app/admin/components/ui/label"
import { HornSpecification } from "@prisma/client"


interface HornSpecFormProps {
  initialData: HornSpecification,
  product_name: string
};

export const HornSpecForm: React.FC<HornSpecFormProps> = ({
  initialData, product_name
}) => {
  const [spec, setSpec] = useState<HornSpecification>();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Horn specification' : 'Create Horn specification';
  const description = `For ${product_name}`;
  const toastMessage = initialData ? 'Horn Specification updated.' : 'Horn Specification created.';
  const action = initialData ? 'Save changes' : 'Create';


  useEffect(() => {
    if(initialData){
      setSpec(initialData)
    }
   } , [initialData]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const tempHornSpec : HornSpecification = {
      // @ts-ignore
      diameter_throat: event.target[0].value,
      // @ts-ignore
      ukuran: event.target[1].value,
      // @ts-ignore
      material: event.target[2].value,
       productId: "",
       createdAt:new Date(),
       updatedAt:new Date(),
       id:"",
     }
    try {
      setLoading(true);
      let response: AxiosResponse;
      if (initialData) {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_HORN_SPECIFICATION}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
        const API_EDITED3 = API_EDITED2.replace('{id}', initialData.id)
        response = await axios.patch(API_EDITED3, tempHornSpec);
      } else {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_ADD_HORN_SPECIFICATION}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
        response = await axios.post(API_EDITED2, tempHornSpec);
      }
      if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Session expired, please login again");
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again");
      }
      else if(response.data === 'unauthorized'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Unauthorized!");
      }
      else{
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/products`);
        router.refresh();
        toast.success(toastMessage);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
        <form onSubmit={onSubmit} className="space-y-4 w-full">
          <div className="grid md:grid-cols-3 grid-cols-1 md:gap-8 gap-4 border rounded-lg p-4 shadow-lg">
            <div>
            <Label htmlFor="diameter_throat" className="font-bold">Diameter Throat (inch)</Label>
            <Input disabled={loading} id="diameter_throat" placeholder="diameter throat value" defaultValue={spec?.diameter_throat? spec.diameter_throat : ""} />
            </div>
            <div>
            <Label htmlFor="ukuran" className="font-bold">Ukuran (mm)</Label>
            <Input disabled={loading} id="ukuran" placeholder="ukuran value" defaultValue={spec?.ukuran? spec.ukuran : ""} />
            </div>
            <div>
            <Label htmlFor="material" className="font-bold">Material</Label>
            <Input disabled={loading} id="material" placeholder="material value" defaultValue={spec?.material? spec.material : ""} />
            </div>
            </div>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
    </>
  );
};
