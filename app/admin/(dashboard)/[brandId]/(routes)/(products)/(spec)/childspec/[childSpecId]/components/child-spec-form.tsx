"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { dynamicspecification } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Heading } from "@/app/admin/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/admin/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  nameIndo: z.string().min(1),
  nameEnglish: z.string().min(1),
  unit: z.string().optional(),
});

type ChildSpecFormValues = z.infer<typeof formSchema>

interface ChildSpecFormProps {
  initialData: dynamicspecification | null;
};

export const ChildSpecForm: React.FC<ChildSpecFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Child Specification' : 'Create Child Specification';
  const description = initialData ? `For ${initialData.nameEnglish} (${initialData.nameIndo})` : 'Add a new Child Specification';
  const toastMessage = initialData ? 'Child Specification updated.' : 'Child Specification created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    nameIndo: '',
    nameEnglish: '',
    unit: '',
  }


  const form = useForm<ChildSpecFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ChildSpecFormValues) => {
    try {
      setLoading(true);
    
      let response: AxiosResponse;
      if (initialData) {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/childspec/${params.childSpecId}`, data);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/childspec`, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Child Spec")
      }
      else if(response.data === 'expired_session'){
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/childspec`);
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("validation errors:", errors);
        })} className="space-y-4 w-full">
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <div className="gap-4 border rounded-lg p-4 shadow-lg">
            <div className="pb-2">
              <FormField
                control={form.control}
                name="nameIndo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Name (Indo)</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Child Specification name (Indo)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pb-2">
              <FormField
                control={form.control}
                name="nameEnglish"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Name (English)</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Child Specification name (English)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pb-2">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Unit</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Child Specification unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

          <Button disabled={loading} type="submit" className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
