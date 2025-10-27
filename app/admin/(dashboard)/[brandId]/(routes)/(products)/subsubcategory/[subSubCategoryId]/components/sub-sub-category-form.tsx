"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AllCategory } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/admin/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/app/admin/components/ui/heading"

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
});

type SubSubCategoryFormValues = z.infer<typeof formSchema>

interface SubSubCategoryFormProps {
  initialData: AllCategory | null;
};

export const SubSubCategoryForm: React.FC<SubSubCategoryFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Sub Sub Category' : 'Create Sub Sub Category';
  const description = initialData ? 'Edit a Sub Sub Category.' : 'Add a new Sub Sub Category';
  const toastMessage = initialData ? 'Sub Sub Category updated.' : 'Sub Sub Category created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<SubSubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      type: 'Sub Sub Category'
    }
  });

  const onSubmit = async (data: SubSubCategoryFormValues) => {
    try {
      setLoading(true);
      let response: AxiosResponse;
      if (initialData) {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_SUB_SUB_CATEGORY}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{subSubCategoryId}', params.subSubCategoryId)
        response = await axios.patch(API_EDITED2, data);
      } else {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_ADD_SUB_SUB_CATEGORY}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        response = await axios.post(API_EDITED, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Sub Sub Category")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subsubcategory`);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-8 gap-4 border rounded-lg p-4 shadow-lg">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub Sub Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Description</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub Sub Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
