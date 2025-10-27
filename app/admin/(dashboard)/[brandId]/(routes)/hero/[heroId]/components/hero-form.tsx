"use client"

import * as z from "zod"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Hero, Hero_Image } from "@prisma/client"
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
import Image from "next/image"
import { uploadHeroImage } from "@/app/admin/upload-hero-image"
import { Trash } from "lucide-react"
import Link from "next/link"


const formSchema = z.object({
  nameIndo: z.string().min(1),
  nameEnglish: z.string().optional(),
  featuredDescIndo: z.string().optional(),
  featuredDescEnglish: z.string().optional(),
  buttonLinkUrl: z.string().optional(),
  buttonLinkUrlEnglish: z.string().optional(),
  buttonDescIndo: z.string().optional(),
  buttonDescEnglish: z.string().optional(),
  hero_img: z.object({ url: z.string() }).array(),
  // news_date: z.date().optional(),
});

type HeroFormValues = z.infer<typeof formSchema>

interface HeroFormProps {
  initialData: Hero & {
    hero_img: Hero_Image[]
  } | null;
};

export const HeroForm: React.FC<HeroFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  // const [date, setDate] = useState<Date | undefined>(new Date())
 
  const [heroImage, setHeroImage] = useState<Hero_Image>()
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("")

  const title = initialData ? 'Edit Hero' : 'Add Hero';
  const description_title = `Add or Change This Hero`;
  const toastMessage = initialData ? 'Hero updated.' : 'Hero added.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    nameIndo: '',
    nameEnglish: '',
    featuredDescIndo: '',
    featuredDescEnglish: '',
    buttonDescIndo: '',
    buttonDescEnglish: '',
    buttonLinkUrl: '',
    buttonLinkUrlEnglish: '',
    hero_img: [],
  }

  useEffect(() => {
  const fetchData = async () => {
    if (initialData && initialData.hero_img.length>0) {
      setHeroImage(initialData.hero_img[0]);
    }
    else{
      let temp: Hero_Image = {
        id: Math.random().toString(),
        //@ts-ignore
        heroId: params.heroId,
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setHeroImage(temp)
    }
  };
  
  fetchData().catch((error) => {
    console.error("Error fetching hero: ", error);
  });
  }, [params.heroId, initialData, initialData?.hero_img]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
  };

  const deleteImage = async () => {
    let temp: Hero_Image = {
      id: '',
      //@ts-ignore
      heroId: params.heroId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setHeroImage(temp)
  };

  async function handleImageUpload (file: File): Promise<Hero_Image> {
    if (file) {
      let updatedheroImage = heroImage;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadHeroImage(formData);
        updatedheroImage!.url = url
        return updatedheroImage!;
        } catch (error) {
        console.error("Error uploading hero image:", error);
        let temp: Hero_Image = {
          id: Math.random().toString(),
          //@ts-ignore
          heroId: params.heroId,
          url: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        return temp;
      }
    }
    let temp: Hero_Image = {
      id: Math.random().toString(),
      //@ts-ignore
      heroId: params.heroId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return temp;
  };


  const form = useForm<HeroFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: HeroFormValues) => {
    try {
      setLoading(true);

      if (selectedFile) {
        data.hero_img[0] = await handleImageUpload(selectedFile);
      }
      else{
        data.hero_img[0] = heroImage!
      }

      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_HERO}`;
      //@ts-ignore
      const API_EDITED = API.replace('{brandId}', params.brandId)
      //@ts-ignore
      const API_EDITED2 = API_EDITED.replace('{heroId}', params.heroId)
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/hero`);
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
        <Heading title={title} description='' />
        <div className="flex gap-1.5">Check text placement <Link href={'/images/admin/hero-place.png'} target="blank" className="text-primary hover:underline">here</Link></div>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-lg">
              <div className="text-left font-bold pb-2">Cover Image</div>
              <div className="flex space-x-4 justify-between items-center">
                {heroImage && heroImage.url !== '' && (
                  <Image alt={title} src={heroImage.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${heroImage.url}` : heroImage.url} width={200} height={200} className="w-52 h-fit" priority/>
                )}
                {heroImage && heroImage.url === '' && (
                <Input
                  id={`file`}
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={(e) =>
                    e.target.files && handleFileChange(e) // Ensure your file upload function can handle image files
                  }
                  disabled={loading}
                  className="border border-gray-300 p-2 rounded-md"
                />
                )}
                 {heroImage && heroImage.url !== '' && (
                <Button
                  variant={"destructive"}
                  onClick={() => deleteImage()}
                >
                  <Trash width={20} height={20} />
                </Button>
              )}
              </div>
          </div>


          <div className="border rounded-lg p-4 shadow-lg gap-4 flex items-center w-full">
            <div className="w-full">
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="nameIndo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Title (Indonesia)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Judul Hero" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="nameEnglish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Title (English)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Hero Title" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>




          <div className="border rounded-lg p-4 shadow-lg gap-4 flex items-center w-full">
            <div className="w-full">
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="featuredDescIndo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Deskripsi (Indo)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Deskripsi Hero" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="featuredDescEnglish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Description (English)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Hero Description" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          
          <div className="border rounded-lg p-4 shadow-lg gap-4 flex items-center w-full">
            <div className="w-full">
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="buttonDescIndo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Deskripsi Tombol (Indo)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Deskripsi Tombol Hero" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="buttonDescEnglish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Button Description (English)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Hero Button Description" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>




          <div className="border rounded-lg p-4 shadow-lg gap-4 flex items-center w-full">
            <div className="w-full">
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="buttonLinkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Link  Tombol (Indo)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Link Tombol untuk Indo" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="py-2">
                <FormField
                  control={form.control}
                  name="buttonLinkUrlEnglish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Link Button (English)</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Link Button for English" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          





        </div>

        



          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

