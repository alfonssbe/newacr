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
import { ThieleSmallParameters2Ohm } from "@prisma/client"
import { Switch } from "@/app/admin/components/ui/switch"


interface ThieleSpecFormProps {
  thiele2: ThieleSmallParameters2Ohm,
  product_name: string
};

export const ThieleSpecForm: React.FC<ThieleSpecFormProps> = ({
  thiele2, product_name
}) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const title = thiele2 ? 'Edit Thiele Small Parameters (Do not add units)' : 'Create Thiele Small Parameters (Do not add units)';
  const description = `For ${product_name}`;
  const toastMessage = thiele2 ? 'Thiele Small Parameters updated.' : 'Thiele Small Parameters created.';
  const action = thiele2 ? 'Save changes' : 'Create';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      
    const tempThieleSmallParameters2 : ThieleSmallParameters2Ohm = {
      // @ts-ignore
      fs: event.target[0].value,
      // @ts-ignore
      dcr: event.target[1].value,
      // @ts-ignore
      qts: event.target[2].value,
      // @ts-ignore
      qes: event.target[3].value,
      // @ts-ignore
      qms: event.target[4].value,
      // @ts-ignore
      mms: event.target[5].value,
      // @ts-ignore
      cms: event.target[6].value,
      // @ts-ignore
      bl_product: event.target[7].value,
      // @ts-ignore
      vas: event.target[8].value,
      // @ts-ignore
      no: event.target[9].value,
      // @ts-ignore
      sd: event.target[10].value,
      // @ts-ignore
      x_max: event.target[11].value,
       productId: "",
       createdAt:new Date(),
       updatedAt:new Date(),
       id:"",
     }
     
    try {
      setLoading(true);
      let response: AxiosResponse;
      if (thiele2) {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_THIELE_2}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
        const API_EDITED3 = API_EDITED2.replace('{id}', thiele2.id)
        response = await axios.patch(API_EDITED3, tempThieleSmallParameters2);
      } else {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_ADD_THIELE_2}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
        response = await axios.post(API_EDITED2, tempThieleSmallParameters2);
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
            <Label htmlFor="fs" className="font-bold">Frekuensi Resonansi / Fs (Hz)</Label>
            <Input disabled={loading} id="fs" placeholder="fs value" defaultValue={thiele2?.fs? thiele2.fs : ""} />
            </div>
            <div>
            <Label htmlFor="dcr" className="font-bold">DCR (Ω)</Label>
            <Input disabled={loading} id="dcr" placeholder="dcr value" defaultValue={thiele2?.dcr? thiele2.dcr : ""} />
            </div>
            <div>
            <Label htmlFor="qts" className="font-bold">Qts</Label>
            <Input disabled={loading} id="qts" placeholder="qts value" defaultValue={thiele2?.qts? thiele2.qts : ""} />
            </div>
            <div>
            <Label htmlFor="qes" className="font-bold">Qes</Label>
            <Input disabled={loading} id="qes" placeholder="qes value" defaultValue={thiele2?.qes? thiele2.qes : ""} />
            </div>
            <div>
            <Label htmlFor="qms" className="font-bold">Qms</Label>
            <Input disabled={loading} id="qms" placeholder="qms value" defaultValue={thiele2?.qms? thiele2.qms : ""} />
            </div>
            <div>
            <Label htmlFor="mms" className="font-bold">Mms (g)</Label>
            <Input disabled={loading} id="mms" placeholder="mms value" defaultValue={thiele2?.mms? thiele2.mms : ""} />
            </div>
            <div>
            <Label htmlFor="cms" className="font-bold">Cms (mm/N)</Label>
            <Input disabled={loading} id="cms" placeholder="cms value" defaultValue={thiele2?.cms? thiele2.cms : ""} />
            </div>
            <div>
            <Label htmlFor="bl_product" className="font-bold">BL Product (Tm)</Label>
            <Input disabled={loading} id="bl_product" placeholder="bl_product value" defaultValue={thiele2?.bl_product? thiele2.bl_product : ""} />
            </div>
            <div>
            <Label htmlFor="vas" className="font-bold">Vas (liters)</Label>
            <Input disabled={loading} id="vas" placeholder="vas value" defaultValue={thiele2?.vas? thiele2.vas : ""} />
            </div>
            <div>
            <Label htmlFor="no" className="font-bold">No (%)</Label>
            <Input disabled={loading} id="no" placeholder="no value" defaultValue={thiele2?.no? thiele2.no : ""} />
            </div>
            <div>
            <Label htmlFor="sd" className="font-bold">Sd (cm²)</Label>
            <Input disabled={loading} id="sd" placeholder="sd value" defaultValue={thiele2?.sd? thiele2.sd : ""} />
            </div>
            <div>
            <Label htmlFor="x_max" className="font-bold">x_max (mm)</Label>
            <Input disabled={loading} id="x_max" placeholder="x_max value" defaultValue={thiele2?.x_max? thiele2.x_max : ""} />
            </div>
          </div>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
    </>
  );
};
