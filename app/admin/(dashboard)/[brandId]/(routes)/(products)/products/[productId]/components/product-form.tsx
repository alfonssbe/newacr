"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Cover_Image, Drawing_Image, Graph_Image, Image_Catalogues, Impedance_Image, multipleDatasheetProduct, Product, Size } from "@prisma/client"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/admin/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/app/admin/components/ui/textarea"
import Link from "next/link"
import { uploadProductDatasheet } from "@/app/admin/upload-product-datasheet"
import Image from "next/image"
import { uploadCoverImage } from "@/app/admin/upload-cover-image"
import { uploadDrawingImage } from "@/app/admin/upload-drawing-image"
import { uploadFrequencyResponseImage } from "@/app/admin/upload-frequency-response-image"
import { uploadImageCatalogues } from "@/app/admin/upload-image-catalogues"
import { uploadImpedanceImage } from "@/app/admin/upload-impedance-image"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import HeadingTiptap from '@tiptap/extension-heading';
import ImageTiptap from '@tiptap/extension-image';
import LinkTiptap from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Toggle } from "@/app/admin/components/ui/toggle"
import { Bold, CirclePlus, File, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Italic, List, ListOrdered, LucideLink, LucideUnlink, Strikethrough, Trash } from "lucide-react"


const formSchema = z.object({
  name: z.string().min(1),
  images_catalogues: z.object({ url: z.string() }).array(),
  cover_img: z.object({ url: z.string() }).array(),
  drawing_img: z.object({ url: z.string() }).array(),
  graph_img: z.object({ url: z.string() }).array(),
  impedance_img: z.object({ url: z.string() }).array(),
  multipleDatasheetProduct: z.object({ url: z.string() }).array(),
  description: z.string().min(0).optional(),
  description_english: z.string().min(0).optional(),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  isNewProduct: z.boolean().default(false).optional(),
  isHorn: z.boolean().default(false).optional(),
  isCeiling: z.boolean().default(false).optional(),
  haveSparepart: z.boolean().default(false).optional(),
  series: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: Product & {
    images_catalogues: Image_Catalogues[]
    cover_img: Cover_Image[]
    drawing_img: Drawing_Image[]
    graph_img: Graph_Image[]
    impedance_img: Impedance_Image[]
    multipleDatasheetProduct: multipleDatasheetProduct[]
  } | null;
  sizes: Size[];
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [allDatasheet, setAllDatasheet] = useState<multipleDatasheetProduct[]>([]);
  const [selectedDatasheetFile, setSelectedDatasheetFile] = useState<File[]>([]);

  const [coverImgUrl, setCoverImgUrl] = useState<Cover_Image>();
  const [coverImg, setCoverImg] = useState<File>();

  const [drawingImgUrl, setDrawingImgUrl] = useState<Drawing_Image>();
  const [drawingImg, setDrawingImg] = useState<File>();
  
  const [freqResponseUrl, setFreqResponseUrl] = useState<Graph_Image>();
  const [freqResponseImg, setfreqResponseImg] = useState<File>();
  
  const [impedanceUrl, setImpedanceUrl] = useState<Graph_Image>();
  const [impedanceImg, setImpedanceImg] = useState<File>();
  
  const [imgCataloguesUrl, setImgCataloguesUrl] = useState<Image_Catalogues[]>([]);
  const [imgCatalogues, setImgCatalogues] = useState<File[]>([]);


  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? `For ${initialData.name}` : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    images_catalogues: [],
    cover_img: [],
    drawing_img: [],
    graph_img: [],
    impedance_img: [],
    multipleDatasheetProduct: [],
    description: '',
    description_english: '',
    sizeId: '',
    isFeatured: false,
    isArchived: false,
    isNewProduct: false,
    isHorn: false,
    isCeiling: false,
    haveSparepart: false,
    series: '',
  }


  useEffect(() => {
    const fetchData = async () => {
      if (initialData && initialData.multipleDatasheetProduct) {
        setAllDatasheet(initialData.multipleDatasheetProduct);
      }

      if (initialData && initialData.cover_img) {
        setCoverImgUrl(initialData.cover_img[0]);
      }
      else{
        let temp: Cover_Image = {
          id: Math.random().toString(),
          //@ts-ignore
          productId: params.productId,
          url: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setCoverImgUrl(temp)
      }

      if (initialData && initialData.drawing_img) {
        setDrawingImgUrl(initialData.drawing_img[0]);
      }
      else{
        let temp: Drawing_Image = {
          id: Math.random().toString(),
          //@ts-ignore
          productId: params.productId,
          url: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setDrawingImgUrl(temp)
      }

      if (initialData && initialData.graph_img) {
        setFreqResponseUrl(initialData.graph_img[0]);
      }
      else{
        let temp: Graph_Image = {
          id: Math.random().toString(),
          //@ts-ignore
          productId: params.productId,
          url: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setFreqResponseUrl(temp)
      }

      if (initialData && initialData.impedance_img) {
        setImpedanceUrl(initialData.impedance_img[0]);
      }
      else{
        let temp: Impedance_Image = {
          id: Math.random().toString(),
          //@ts-ignore
          productId: params.productId,
          url: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setImpedanceUrl(temp)
      }
      
      if (initialData && initialData.images_catalogues) {
        setImgCataloguesUrl(initialData.images_catalogues);
      }
    };
  
    fetchData().catch((error) => {
      console.error("Error fetching data: ", error);
    });
  
  }, [params.productId, initialData, initialData?.multipleDatasheetProduct, initialData?.cover_img, initialData?.drawing_img, initialData?.graph_img, initialData?.impedance_img, initialData?.images_catalogues]); 


  //MULTIPLE DATASHEET
  const addDatasheetCounter = () => {
    //@ts-ignore
    setAllDatasheet((prev) => [
      ...prev,
      {
        id: Math.random().toString(), // Using a random id for uniqueness
        productId: params.productId,
        url: "",
        name: "",
      },
    ]);
  };

  const reduceDatasheetCounter = (index: number) => {
    setAllDatasheet((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDatasheetFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const tempfile = e.target.files?.[0];
    let temp = selectedDatasheetFile
    temp[index] = tempfile!
    setSelectedDatasheetFile(temp);
  };

  async function handleDatasheetFileUpload(file: File[]): Promise<multipleDatasheetProduct[]> {
    if (file && file.length > 0) {
      let updatedDatasheet = [...allDatasheet];
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('file', value);
            const url = await uploadProductDatasheet(formData);
            updatedDatasheet[updatedDatasheet.length - (file.length - index)].url = url;
          }
        });
        await Promise.all(uploadPromises);
        return updatedDatasheet;
      } catch (error) {
        console.error("Error uploading files:", error);
        return [];
      }
    }  
    return [];
  }
  
  
  //COVER IMAGE
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCoverImg(file);
  };

  const deleteCoverImage = async () => {
    let temp: Cover_Image = {
      id: '',
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setCoverImgUrl(temp)
  }

  async function handleCoverImageUpload(file: File): Promise<Cover_Image> {
    if (file) {
      let updatedCoverImage = coverImgUrl ?? {
        id: Math.random().toString(),
        productId: params.productId?.toString() ?? '',
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const url = await uploadCoverImage(formData);
        updatedCoverImage.url = url;
        return updatedCoverImage;
      } catch (error) {
        console.error("Error uploading cover image:", error);
        let temp: Cover_Image = {
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
    let temp: Cover_Image = {
      id: Math.random().toString(),
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return temp;
  }


   //DRAWING IMAGE
   const handleDrawingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setDrawingImg(file);
  };

  const deleteDrawingImage = async () => {
    let temp: Drawing_Image = {
      id: '',
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setDrawingImgUrl(temp)
  }

  async function handleDrawingImageUpload(file: File): Promise<Drawing_Image> {
    if (file) {
      let updatedDrawingImage = drawingImgUrl ?? {
        id: Math.random().toString(),
        productId: params.productId?.toString() ?? '',
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const url = await uploadDrawingImage(formData);
        updatedDrawingImage.url = url;
        return updatedDrawingImage;
      } catch (error) {
        console.error("Error uploading drawing image:", error);
        let temp: Drawing_Image = {
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
    let temp: Drawing_Image = {
      id: Math.random().toString(),
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return temp;
  }


  //FREQUENCY RESPONSE IMAGE
  const handleFrequencyResponseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setfreqResponseImg(file);
  };

  const deleteFrequencyResponseImage = async () => {
    let temp: Graph_Image = {
      id: '',
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setFreqResponseUrl(temp)
  }

  async function handleFrequencyResponseImageUpload(file: File): Promise<Graph_Image> {
    if (file) {
      let updatedFrequencyResponseImage = freqResponseUrl ?? {
        id: Math.random().toString(),
        productId: params.productId?.toString() ?? '',
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const url = await uploadFrequencyResponseImage(formData);
        updatedFrequencyResponseImage.url = url;
        return updatedFrequencyResponseImage;
      } catch (error) {
        console.error("Error uploading frequency response image:", error);
        let temp: Graph_Image = {
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
    let temp: Graph_Image = {
      id: Math.random().toString(),
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return temp;
  }




  //IMPEDANCE IMAGE
  const handleImpedanceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImpedanceImg(file);
  };

  const deleteImpedanceImage = async () => {
    let temp: Impedance_Image = {
      id: '',
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setImpedanceUrl(temp)
  }

  async function handleImpedanceImageUpload(file: File): Promise<Impedance_Image> {
    if (file) {
      let updatedImpedanceImage = impedanceUrl ?? {
        id: Math.random().toString(),
        productId: params.productId?.toString() ?? '',
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const url = await uploadImpedanceImage(formData);
        updatedImpedanceImage.url = url;
        return updatedImpedanceImage;
      } catch (error) {
        console.error("Error uploading impedance image:", error);
        let temp: Graph_Image = {
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
    let temp: Impedance_Image = {
      id: Math.random().toString(),
      //@ts-ignore
      productId: params.productId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return temp;
  }


  //MULTIPLE IMAGE CATALOGUES
  const addImageCataloguesCounter = () => {
    //@ts-ignore
    setImgCataloguesUrl((prev) => [
      ...prev,
      {
        id: Math.random().toString(), // Using a random id for uniqueness
        productId: params.productId,
        url: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  const reduceImageCataloguesCounter = (index: number) => {
    setImgCataloguesUrl((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageCataloguesFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const tempfile = e.target.files?.[0];
    let temp = imgCatalogues
    temp[index] = tempfile!
    setImgCatalogues(temp);
  };

  async function handleImageCataloguesFileUpload(file: File[]): Promise<Image_Catalogues[]> {
    if (file && file.length > 0) {
      let updatedImageCatalogues = [...imgCataloguesUrl];
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('image', value);
            const url = await uploadImageCatalogues(formData);
            updatedImageCatalogues[updatedImageCatalogues.length - (file.length - index)].url = url;
          }
        });
        await Promise.all(uploadPromises);
        return updatedImageCatalogues;
      } catch (error) {
        console.error("Error uploading image catalogues:", error);
        return [];
      }
    }  
    return [];
  }


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
        
      if (selectedDatasheetFile && selectedDatasheetFile.length > 0) {
        data.multipleDatasheetProduct = await handleDatasheetFileUpload(selectedDatasheetFile)
      }
      else{
        data.multipleDatasheetProduct = allDatasheet
      }

      if (coverImg) {
        data.cover_img[0] = await handleCoverImageUpload(coverImg)
      }
      else{
        data.cover_img[0] = coverImgUrl!
      }

      if (drawingImg) {
        data.drawing_img[0] = await handleDrawingImageUpload(drawingImg)
      }
      else{
        data.drawing_img[0] = drawingImgUrl!
      }

      if (freqResponseImg) {
        data.graph_img[0] = await handleFrequencyResponseImageUpload(freqResponseImg)
      }
      else{
        data.graph_img[0] = freqResponseUrl!
      }

      if (impedanceImg) {
        data.impedance_img[0] = await handleImpedanceImageUpload(impedanceImg)
      }
      else{
        data.impedance_img[0] = impedanceUrl!
      }

      if (imgCatalogues && imgCatalogues.length > 0) {
        data.images_catalogues = await handleImageCataloguesFileUpload(imgCatalogues)
      }
      else{
        data.images_catalogues = imgCataloguesUrl
      }




      if (editor && editor.getHTML() && editor.getHTML() !== '<p></p>') {
        data.description = editor.getHTML();
      }
      else {
        data.description = ''
      }

      if (editorEnglish && editorEnglish.getHTML() && editorEnglish.getHTML() !== '<p></p>') {
        data.description_english = editorEnglish.getHTML();
      }
      else {
        data.description_english = ''
      }

      let response: AxiosResponse;
      if (initialData) {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_PRODUCT}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
        response = await axios.patch(API_EDITED2, data);
      } else {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_ADD_PRODUCT}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        response = await axios.post(API_EDITED, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Product")
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




  const editorEnglish = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      HeadingTiptap.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      ImageTiptap,
      BulletList,
      OrderedList,
      LinkTiptap.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url: string, ctx:any) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p: string | { scheme: string }) => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch (error) {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch (error) {
            return false
          }
        },

      }),
      Text,
      TextStyle,
      Color,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-hidden',
      },
    },
    content: initialData?.description_english ? initialData.description_english : '',
  });






  
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      HeadingTiptap.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      ImageTiptap,
      BulletList,
      OrderedList,
      LinkTiptap.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url: string, ctx:any) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p: string | { scheme: string }) => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch (error) {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch (error) {
            return false
          }
        },

      }),
      Text,
      TextStyle,
      Color,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-hidden',
      },
    },
    content: initialData?.description ? initialData.description : '',
  });

  

    
const setLinkEnglish = useCallback(() => {
  if (!editorEnglish) return

  const previousUrl = editorEnglish.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) return

  if (url === '') {
    editorEnglish.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editorEnglish.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}, [editorEnglish])

const setLink = useCallback(() => {
  if (!editor) return

  const previousUrl = editor.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) return

  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}, [editor])

if (!editor || !editorEnglish) return null
  
  return (  
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-lg">
            <div className="text-center pb-2">
              <div className="text-left font-bold">Cover Image</div>
            </div>
            <div>
                <div
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                  {coverImgUrl && (coverImgUrl!.url !== undefined && coverImgUrl.url !== '') ?
                  <>
                  <div className="flex items-center space-x-4">
                    {coverImgUrl && (coverImgUrl!.url !== undefined && coverImgUrl.url !== '') &&
                      <Image
                      src={coverImgUrl!.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${coverImgUrl!.url}` : coverImgUrl!.url}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                      className="w-32 h-fit"
                      priority
                      />
                    }
                  </div>
                  <Button
                  // className="bg-red-500 text-white py-1 px-3 rounded-md cursor-pointer hover:bg-red-600"
                  variant={"destructive"}
                  onClick={() => deleteCoverImage()}
                >
                  <Trash width={20} height={20} />
                </Button>
                </>
                :
                    <Input
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleCoverImageChange(e)
                      }
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                      required
                    />
                    }
                </div>
            </div>
          </div>

          <div className="flex flex-col w-full justify-center border rounded-lg p-4 gap-2 shadow-lg">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-base">Product Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-base">Product Size</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>



        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 shadow-lg">
            <div className="text-center pb-2">
              <div className="text-left font-bold">Drawing Image</div>
            </div>
            <div>
                <div
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                  <div className="flex items-center space-x-4">
                    {drawingImgUrl && (drawingImgUrl!.url !== undefined && drawingImgUrl.url !== '') && (
                      <Image
                      src={drawingImgUrl!.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawingImgUrl!.url}` : drawingImgUrl!.url}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                      className="w-32 h-fit"
                      />
                    )}
                    {(!drawingImgUrl || (drawingImgUrl.url === '')) && (
                      <Input
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleDrawingImageChange(e)
                        }
                        disabled={loading}
                      />
                    )}
                  </div>
                  {drawingImgUrl && (drawingImgUrl!.url !== undefined && drawingImgUrl.url !== '') && (
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteDrawingImage()}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  )}
                </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 shadow-lg">
            <div className="text-center pb-2">
              <div className="text-left font-bold">Frequency Response Image</div>
            </div>
            <div>
                <div
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                  <div className="flex items-center space-x-4">
                    {freqResponseUrl && (freqResponseUrl!.url !== undefined && freqResponseUrl.url !== '') && (
                      <Image
                      src={freqResponseUrl!.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${freqResponseUrl!.url}` : freqResponseUrl!.url}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                      className="w-32 h-fit"
                      />
                    )}
                    {(!freqResponseUrl || (freqResponseUrl.url === '')) && (
                      <Input
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleFrequencyResponseImageChange(e)
                        }
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    )}
                  </div>
                  {freqResponseUrl && (freqResponseUrl!.url !== undefined && freqResponseUrl.url !== '') && (
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteFrequencyResponseImage()}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  )}
                </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-lg">
            <div className="text-center pb-2">
              <div className="text-left font-bold">Impedance Image</div>
            </div>
            <div>
                <div
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                  <div className="flex items-center space-x-4">
                    {impedanceUrl && (impedanceUrl!.url !== undefined && impedanceUrl.url !== '') && (
                      <Image
                      src={impedanceUrl!.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${impedanceUrl!.url}` : impedanceUrl!.url}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                      className="w-32 h-fit"
                      />
                    )}
                    {(!impedanceUrl || (impedanceUrl.url === '')) && (
                      <Input
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleImpedanceImageChange(e)
                        }
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    )}
                  </div>
                  {impedanceUrl && (impedanceUrl!.url !== undefined && impedanceUrl.url !== '') && (
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteImpedanceImage()}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  )}
                </div>
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-lg">
            <div className="text-center flex items-center justify-between pb-2">
              <div className="text-left font-bold">Datasheet</div>
              <div
                onClick={addDatasheetCounter}
                className="flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-lg hover:cursor-pointer"
              >
                <CirclePlus width={20} height={20} />Add Datasheet
              </div>
            </div>
            <div>
              {allDatasheet.map((value, index) => (
                <div
                  key={value.id}
                  className="flex items-center justify-between rounded-md p-2 shadow-md mb-2 border"
                >
                  <div className="flex items-center space-x-4">
                    {value?.url && value.url !== '' && (
                      <Link
                        href={value.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline transition-colors whitespace-nowrap flex items-center gap-2"
                      >
                        <File width={20} height={20}/> View File
                      </Link>
                    )}
                    {value.url === '' && (
                      <Input
                        id={`file-${index}`}
                        type="file"
                        accept=".pdf"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleDatasheetFileChange(e, index)
                        }
                        disabled={loading}
                        // className="border border-gray-300 p-2 rounded-md"
                      />
                    )}
                    <Input
                      type="text"
                      defaultValue={value.name}
                      placeholder="PDF File name"
                      onChange={(e) => {
                        const updatedDatasheet = [...allDatasheet];
                        updatedDatasheet[index].name = e.target.value;
                        setAllDatasheet(updatedDatasheet);
                      }}
                      required
                      // className="border border-gray-300 p-2 rounded-md w-full"
                    />
                  </div>
                  <Button
                    variant={"destructive"}
                    onClick={() => reduceDatasheetCounter(index)}
                  >
                    <Trash width={20} height={20} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-lg">
            <div className="text-center flex items-center justify-between pb-2">
              <div className="text-left font-bold">Image Catalogues</div>
              <div
                onClick={addImageCataloguesCounter}
                className="flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-lg hover:cursor-pointer"
              >
                <CirclePlus width={20} height={20} />Add Image Catalogues
              </div>
            </div>
            <div>
              {imgCataloguesUrl.map((value, index) => (
                <div
                  key={value.id}
                  className="flex items-center justify-between rounded-md p-2 shadow-md mb-2 border"
                >
                  <div className="flex items-center space-x-4">
                    {value.url !== '' && (
                      <Image
                      src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                        className="w-32 h-fit"
                      />
                    )}
                    {value.url === '' && (
                      <Input
                        id={`image-catalogues-${index}`}
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleImageCataloguesFileChange(e, index)
                        }
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    )}
                    <Input
                      type="text"
                      defaultValue={value.name}
                      placeholder="Input this image name"
                      onChange={(e) => {
                        const updatedImageCatalogues = [...imgCataloguesUrl];
                        updatedImageCatalogues[index].name = e.target.value;
                        setImgCataloguesUrl(updatedImageCatalogues);
                      }}
                      required
                      className="border border-gray-300 p-2 rounded-md w-48"
                    />
                  </div>
                  <Button
                    variant={"destructive"}
                    onClick={() => reduceImageCataloguesCounter(index)}
                  >
                    <Trash width={20} height={20} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>



          <div className="md:grid md:grid-cols-1 gap-4">
            <div className="border rounded-lg p-4 shadow-lg">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left font-bold text-base">Description (Indonesia)</FormLabel>
                    <FormDescription></FormDescription>
                    <FormControl>
                      {/* <Textarea disabled={loading} placeholder="Product description" {...field} /> */}
                      <div className="border-2 rounded-lg p-2">
                        <div className="flex gap-2 mb-4 flex-wrap">
                          <Toggle
                            pressed={editor.isActive('bold')}
                            onClick={() => editor.chain().focus().toggleBold().run()}
                          >
                            <Bold className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editor.isActive('italic')}
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                          >
                            <Italic className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editor.isActive('strike')}
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                          >
                            <Strikethrough className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editor.isActive('bulletList')}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                          >
                            <List className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editor.isActive('orderedList')}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          >
                            <ListOrdered className="w-4 h-4" />
                          </Toggle>
                          {[1, 2, 3, 4, 5, 6].map((level) => (
                            <Toggle
                              key={level}
                              pressed={editor.isActive('heading', { level })}
                              onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()}
                            >
                              {level === 1 && <Heading1 className="w-4 h-4" />}
                              {level === 2 && <Heading2 className="w-4 h-4" />}
                              {level === 3 && <Heading3 className="w-4 h-4" />}
                              {level === 4 && <Heading4 className="w-4 h-4" />}
                              {level === 5 && <Heading5 className="w-4 h-4" />}
                              {level === 6 && <Heading6 className="w-4 h-4" />}
                            </Toggle>
                          ))}
                          
                          <Toggle
                            pressed={editor.isActive('link')}
                            onClick={setLink}
                          >
                              <LucideLink className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={!editor.isActive('link')}
                            onClick={() => editor.chain().focus().unsetLink().run()}
                          >
                              <LucideUnlink className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            onClick={() => editor.chain().focus().setColor('#e60013').run()}
                            pressed={false}
                            // className={editor.isActive('textStyle', { color: '#ed3237' }) ? 'is-active' : ''}
                          >
                            <p className="text-primary">Red</p>
                          </Toggle>
                          <Toggle
                            onClick={() => editor.chain().focus().unsetColor().run()}
                            pressed={false}
                          >
                            Black
                          </Toggle>
                        </div>
                          
                          {/* <Input  
                            id={`file`}
                            type="file"
                            accept="image/*"
                            name="file"
                            onChange={(e) =>
                              e.target.files && handleFileChangeTiptap(e)
                            }
                            className="border border-gray-300 p-2 rounded-md"
                          /> */}

                        <EditorContent editor={editor} className="border p-4"/>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="border rounded-lg p-4 shadow-lg">
              <FormField
                control={form.control}
                name="description_english"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left font-bold text-base">Description (English)</FormLabel>
                    <FormDescription></FormDescription>
                    <FormControl>
                      {/* <Textarea disabled={loading} placeholder="Product description" {...field} /> */}
                      <div className="border-2 rounded-lg p-2">
                        <div className="flex gap-2 mb-4 flex-wrap">
                          <Toggle
                            pressed={editorEnglish.isActive('bold')}
                            onClick={() => editorEnglish.chain().focus().toggleBold().run()}
                          >
                            <Bold className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editorEnglish.isActive('italic')}
                            onClick={() => editorEnglish.chain().focus().toggleItalic().run()}
                          >
                            <Italic className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editorEnglish.isActive('strike')}
                            onClick={() => editorEnglish.chain().focus().toggleStrike().run()}
                          >
                            <Strikethrough className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editorEnglish.isActive('bulletList')}
                            onClick={() => editorEnglish.chain().focus().toggleBulletList().run()}
                          >
                            <List className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={editorEnglish.isActive('orderedList')}
                            onClick={() => editorEnglish.chain().focus().toggleOrderedList().run()}
                          >
                            <ListOrdered className="w-4 h-4" />
                          </Toggle>
                          {[1, 2, 3, 4, 5, 6].map((level) => (
                            <Toggle
                              key={level}
                              pressed={editorEnglish.isActive('heading', { level })}
                              onClick={() => editorEnglish.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()}
                            >
                              {level === 1 && <Heading1 className="w-4 h-4" />}
                              {level === 2 && <Heading2 className="w-4 h-4" />}
                              {level === 3 && <Heading3 className="w-4 h-4" />}
                              {level === 4 && <Heading4 className="w-4 h-4" />}
                              {level === 5 && <Heading5 className="w-4 h-4" />}
                              {level === 6 && <Heading6 className="w-4 h-4" />}
                            </Toggle>
                          ))}
                          
                          <Toggle
                            pressed={editorEnglish.isActive('link')}
                            onClick={setLinkEnglish}
                          >
                              <LucideLink className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            pressed={!editorEnglish.isActive('link')}
                            onClick={() => editorEnglish.chain().focus().unsetLink().run()}
                          >
                              <LucideUnlink className="w-4 h-4" />
                          </Toggle>
                          <Toggle
                            onClick={() => editorEnglish.chain().focus().setColor('#e60013').run()}
                            pressed={false}
                            // className={editorEnglish.isActive('textStyle', { color: '#ed3237' }) ? 'is-active' : ''}
                          >
                            <p className="text-primary">Red</p>
                          </Toggle>
                          <Toggle
                            onClick={() => editorEnglish.chain().focus().unsetColor().run()}
                            pressed={false}
                          >
                            Black
                          </Toggle>
                        </div>
                          
                          {/* <Input  
                            id={`file`}
                            type="file"
                            accept="image/*"
                            name="file"
                            onChange={(e) =>
                              e.target.files && handleFileChangeTiptap(e)
                            }
                            className="border border-gray-300 p-2 rounded-md"
                          /> */}

                        <EditorContent editor={editorEnglish} className="border p-4"/>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>



          <div className="border rounded-lg p-4 shadow-lg">
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
                      This product will appear on the homepage slideshow. <Link href={'/images/admin/new-product-place.png'} target="blank" className="text-primary hover:underline">Click here to see where it will appear.</Link>
                    </FormDescription>
                    {/* <div className="text-xs font-semibold">Note: To be displayed, you need to add the backgorund image through the &quot;Featured Products&quot; menu.</div> */}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 shadow-lg">
            <FormField
              control={form.control}
              name="isArchived"
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
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the website.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="isNewProduct"
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
                      New Product
                    </FormLabel>
                    <FormDescription>
                     This product will appear in <b>New Products</b> page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> */}
             <FormField
              control={form.control}
              name="isHorn"
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
                      Horn Product
                    </FormLabel>
                    <FormDescription>
                     Check this if this product is a horn product.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isCeiling"
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
                      Ceiling Product
                    </FormLabel>
                    <FormDescription>
                     Check this if this product is a ceiling product.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="haveSparepart"
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
                      Have Sparepart
                    </FormLabel>
                    <FormDescription>
                     Check this if this product have sparepart.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="series"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Series</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="What Series" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            </div>
          <Button disabled={loading} type="submit" variant={'default'} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
