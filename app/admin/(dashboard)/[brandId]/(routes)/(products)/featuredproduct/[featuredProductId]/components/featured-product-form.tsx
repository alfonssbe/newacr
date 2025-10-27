"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Featured_Image, Product } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/admin/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/app/admin/components/ui/heading"
import { Checkbox } from "@/components/ui/checkbox"
import { uploadFeaturedImage } from "@/app/admin/upload-featured-image"
import Image from "next/image"


const formSchema = z.object({
  name: z.string().min(1),
  featuredDesc: z.string().min(1),
  featured_img: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
});

type FeaturedProductFormValues = z.infer<typeof formSchema>

interface FeaturedProductFormProps {
  initialData: Product & {
    featured_img: Featured_Image[]
  } | null;
};

export const FeaturedProductForm: React.FC<FeaturedProductFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [featuredImage, setFeaturedImage] = useState<Featured_Image>()
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();

  const title = initialData ? 'Edit Featured Image' : 'Add Featured Image';
  const description = `For ${initialData!.name}`;
  const toastMessage = initialData ? 'Featured Image updated.' : 'Featured Image added.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    featuredDesc: '',
    featured_img: [],
    isFeatured: false,
  }

  useEffect(() => {
  const fetchData = async () => {
    if (initialData && initialData.featured_img.length>0) {
      setFeaturedImage(initialData.featured_img[0]);
    }
    else{
      let temp: Featured_Image = {
        id: Math.random().toString(),
        //@ts-ignore
        productId: params.featuredProductId,
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setFeaturedImage(temp)
    }
  };
  
  fetchData().catch((error) => {
    console.error("Error fetching featured data: ", error);
  });
  }, [params.featuredProductId, initialData, initialData?.featured_img]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
  };

  const deleteImage = async () => {
    let temp: Featured_Image = {
      id: '',
      //@ts-ignore
      productId: params.featuredProductId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setFeaturedImage(temp)
  };

  async function handleImageUpload (file: File): Promise<Featured_Image> {
    if (file) {
      let updatedFeaturedImage = featuredImage;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadFeaturedImage(formData);
        updatedFeaturedImage!.url = url
        return updatedFeaturedImage!;
        } catch (error) {
        console.error("Error uploading featured image:", error);
        let temp: Featured_Image = {
          id: Math.random().toString(),
          //@ts-ignore
          productId: params.productId,
          url: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        return temp;
      }
    }
    let temp: Featured_Image = {
      id: Math.random().toString(),
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return temp;
  };


  const form = useForm<FeaturedProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: FeaturedProductFormValues) => {
    try {
      setLoading(true);

      if (selectedFile) {
        data.featured_img[0] = await handleImageUpload(selectedFile);
      }
      else{
        data.featured_img[0] = featuredImage!
      }

      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_ADD_FEATURED_PRODUCT}`;
      //@ts-ignore
      const API_EDITED = API.replace('{brandId}', params.brandId)
      //@ts-ignore
      const API_EDITED2 = API_EDITED.replace('{featuredProductId}', params.featuredProductId)
      const response = await axios.patch(API_EDITED2, data);
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/featuredproduct`);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="space-y-2">
            <div
              className="flex items-center justify-between rounded-md shadow-xs"
            >
              <div className="flex items-center space-x-4">
                {featuredImage && featuredImage.url !== '' && (
                  <Image alt={title} src={featuredImage.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${featuredImage.url}` : featuredImage.url} width={200} height={200} className="w-52 h-fit" priority/>
                )}
                <Input
                  id={`file`}
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={(e) =>
                    e.target.files && handleFileChange(e)
                  }
                  disabled={loading}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
              {featuredImage && featuredImage.url !== '' && (
                <div
                  className="bg-red-500 text-white py-1 px-3 rounded-md cursor-pointer hover:bg-red-600"
                  onClick={() => deleteImage()}
                >
                  Delete Image
                </div>
              )}
            </div>
          </div>
           <FormField
              control={form.control}
              name="featuredDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Description</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Featured Products Descriptions" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          <Button disabled={loading} className="ml-auto" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
