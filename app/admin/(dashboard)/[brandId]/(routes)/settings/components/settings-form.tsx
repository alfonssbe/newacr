"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

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
import { AlertModal } from "@/app/admin/components/modals/alert-modal"
import { ApiAlert } from "@/app/admin/components/ui/api-alert"
import { useOrigin } from "@/app/admin/hooks/use-origin"
import { Brand } from "@prisma/client"

const formSchema = z.object({
  name: z.string().min(2),
});

type SettingsFormValues = z.infer<typeof formSchema>

interface SettingsFormProps {
  initialData: Brand;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_EDIT_BRAND}`;
      //@ts-ignore
      const API_EDITED = API.replace('{brandId}', params.brandId)
      const response = await axios.patch(API_EDITED, data);
      if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("Session expired, please login again")
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again")
      }
      else if(response.data === 'not_admin'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("Unauthorized!")
      }
      else{
        router.refresh();
        toast.success('Brand updated.');
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_EDIT_BRAND}`;
      //@ts-ignore
      const API_EDITED = API.replace('{brandId}', params.brandId)
      await axios.delete(API_EDITED);
      router.refresh();
      router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
      toast.success('Brand deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products and categories first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title="Brand settings" description="Manage brand preferences" />
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit" variant={'secondary'}>
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert 
        title="NEXT_PUBLIC_API_URL" 
        variant="public" 
        description={`${origin}${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}`}
      />
    </>
  );
};
