"use client"

import * as z from "zod"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { News, News_Image } from "@prisma/client"
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
import { uploadNewsImage } from "@/app/admin/upload-news-image"
import { Textarea } from "@/app/admin/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/app/admin/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/admin/components/ui/popover"
import { Bold, CalendarIcon, Heading1, Heading4, Heading5, Heading6, Italic, List, ListOrdered, Strikethrough, Link as LinkLucide, Unlink as UnlinkLucide, UnderlineIcon, Quote, ImageIcon, YoutubeIcon, TableIcon, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, GripVertical, GripHorizontal, Trash2, Plus, Undo, Redo, Trash } from "lucide-react"
import { format } from "date-fns"
import { Toggle } from "@/app/admin/components/ui/toggle"
import { Heading2 } from "lucide-react"
import { Heading3 } from "lucide-react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import HeadingTiptap from '@tiptap/extension-heading';
import ImageTiptap from '@tiptap/extension-image';
import LinkTiptap from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from "@tiptap/extension-placeholder"
import Youtube from "@tiptap/extension-youtube"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Underline from "@tiptap/extension-underline"
import './styles.scss'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/admin/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"


const formSchema = z.object({
  title: z.string().min(1),
  title_english: z.string().min(1),
  description: z.string().optional(),
  description_english: z.string().optional(),
  link_url: z.string().optional(),
  link_placeholder: z.string().optional(),
  news_img: z.object({ url: z.string() }).array(),
  news_date: z.date().optional(),
});

type NewsFormValues = z.infer<typeof formSchema>

interface NewsFormProps {
  initialData: News & {
    news_img: News_Image[]
  } | null;
};

export const NewsForm: React.FC<NewsFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date())
 
  const [newsImage, setNewsImage] = useState<News_Image>()
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [tableSize, setTableSize] = useState({ rows: 3, cols: 3 })
  const [linkUrlEnglish, setLinkUrlEnglish] = useState("")
  const [imageUrlEnglish, setImageUrlEnglish] = useState("")
  const [youtubeUrlEnglish, setYoutubeUrlEnglish] = useState("")
  const [tableSizeEnglish, setTableSizeEnglish] = useState({ rows: 3, cols: 3 })
  const maxTitleLength = 60


  const title = initialData ? 'Edit News' : 'Add News';
  const description_title = `Add or Change This News`;
  const toastMessage = initialData ? 'News updated.' : 'News added.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    title: '',
    title_english: '',
    description: '',
    description_english: '',
    link_url: '',
    link_placeholder: '',
    news_img: [],
    news_date: new Date(),
  }

  useEffect(() => {
  const fetchData = async () => {
    if (initialData && initialData.news_img.length>0) {
      setNewsImage(initialData.news_img[0]);
    }
    else{
      let temp: News_Image = {
        id: Math.random().toString(),
        //@ts-ignore
        productId: params.newsId,
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setNewsImage(temp)
    }
    if(initialData && initialData.event_date) {
      setDate(initialData.event_date)
    }
    else{
      setDate(new Date())
    }
  };
  
  fetchData().catch((error) => {
    console.error("Error fetching news: ", error);
  });
  }, [params.newsId, initialData, initialData?.news_img]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
  };

  const deleteImage = async () => {
    let temp: News_Image = {
      id: '',
      //@ts-ignore
      productId: params.newsId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setNewsImage(temp)
  };

  async function handleImageUpload (file: File): Promise<News_Image> {
    if (file) {
      let updatednewsImage = newsImage;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadNewsImage(formData);
        updatednewsImage!.url = url
        return updatednewsImage!;
        } catch (error) {
        console.error("Error uploading news image:", error);
        let temp: News_Image = {
          id: Math.random().toString(),
          //@ts-ignore
          productId: params.newsId,
          url: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        return temp;
      }
    }
    let temp: News_Image = {
      id: Math.random().toString(),
      //@ts-ignore
      productId: params.newsId,
      url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return temp;
  };


  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: NewsFormValues) => {
    try {
      setLoading(true);

      if (selectedFile) {
        data.news_img[0] = await handleImageUpload(selectedFile);
      }
      else{
        data.news_img[0] = newsImage!
      }

      if(date){
      data.news_date = date
      }
      else{
        data.news_date = new Date()
      }

      if(editor && editor.getHTML() && editor.getHTML() !== '<p></p>'){
        data.description = editor.getHTML()
      }
      else{
        data.description = ''
      }


      if (editorEnglish && editorEnglish.getHTML() && editorEnglish.getHTML() !== '<p></p>') {
        data.description_english = editorEnglish.getHTML();
      }
      else {
        data.description_english = ''
      }


      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_NEWS}`;
      //@ts-ignore
      const API_EDITED = API.replace('{brandId}', params.brandId)
      //@ts-ignore
      const API_EDITED2 = API_EDITED.replace('{newsId}', params.newsId)
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/news`);
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
        Underline,
        HeadingTiptap.configure({
          levels: [1, 2, 3, 4, 5, 6],
        }),
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
        ImageTiptap.configure({
          HTMLAttributes: {
            class: "max-w-full rounded-md my-4",
          },
        }),
        Youtube.configure({
          width: 640,
          height: 480,
          HTMLAttributes: {
            class: "my-4 rounded overflow-hidden",
          },
        }),
        Placeholder.configure({
          placeholder: "Write something...",
        }),
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: "border-collapse table-auto w-full my-4",
          },
        }),
        TableRow,
        TableHeader,
        TableCell.configure({
          HTMLAttributes: {
            class: "border border-gray-300 p-2",
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-hidden min-h-[200px] max-w-none",
        },
      },
      content: initialData?.description_english ? initialData.description_english : '<p></p>',
    });



    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Underline,
        HeadingTiptap.configure({
          levels: [1, 2, 3, 4, 5, 6],
        }),
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
        ImageTiptap.configure({
          HTMLAttributes: {
            class: "max-w-full rounded-md my-4",
          },
        }),
        Youtube.configure({
          width: 640,
          height: 480,
          HTMLAttributes: {
            class: "my-4 rounded overflow-hidden",
          },
        }),
        Placeholder.configure({
          placeholder: "Write something...",
        }),
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: "border-collapse table-auto w-full my-4",
          },
        }),
        TableRow,
        TableHeader,
        TableCell.configure({
          HTMLAttributes: {
            class: "border border-gray-300 p-2",
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-hidden min-h-[200px] max-w-none",
        },
      },
      content: initialData?.description ? initialData.description : '<p></p>',
    });
  
    
      const setLinkEnglish = useCallback(() => {
      if (!editorEnglish) return
      const previousUrl = editorEnglish!.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)
  
      // cancelled
      if (url === null) {
        return
      }
  
      // empty
      if (url === '') {
        editorEnglish!.chain().focus().extendMarkRange('link').unsetLink()
          .run()
  
        return
      }
  
      // update link
      editorEnglish!.chain().focus().extendMarkRange('link').setLink({ href: url })
        .run()
    }, [editorEnglish])
  


    const setLink = useCallback(() => {
      const previousUrl = editor!.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)
  
      // cancelled
      if (url === null) {
        return
      }
  
      // empty
      if (url === '') {
        editor!.chain().focus().extendMarkRange('link').unsetLink()
          .run()
  
        return
      }
  
      // update link
      editor!.chain().focus().extendMarkRange('link').setLink({ href: url })
        .run()
    }, [editor])




      const addLinkEnglish = () => {
    if (linkUrlEnglish) {
      editorEnglish!.chain().focus().extendMarkRange("link").setLink({ href: linkUrlEnglish }).run()
      setLinkUrlEnglish("")
    } else {
      editorEnglish!.chain().focus().extendMarkRange("link").unsetLink().run()
    }
  }
  
    const addImageEnglish = useCallback((url: string) => {
      // const url = window.prompt('URL')
  
      if (url) {
        editorEnglish!.chain().focus().setImage({ src: url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${url}` : url }).run()
      }
    }, [editorEnglish])
  
    const addYoutubeVideoEnglish = () => {
      if (youtubeUrlEnglish) {
        editorEnglish!.chain().focus().setYoutubeVideo({ src: youtubeUrlEnglish.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${youtubeUrlEnglish}` : youtubeUrlEnglish }).run()
        setYoutubeUrlEnglish("")
      }
    }

    const insertTableEnglish = () => {
      editorEnglish!.chain().focus().insertTable({ rows: tableSizeEnglish.rows, cols: tableSizeEnglish.cols, withHeaderRow: true }).run()
    }
    
    async function handleImageUploadContentNewsEnglish (file: File): Promise<string> {
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);
  
          const url = await uploadNewsImage(formData);
          return url
          } catch (error) {
            return ''
        }
      }
      return '';
    };

  
    const handleFileChangeTiptapEnglish = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        let testUrl = await handleImageUploadContentNewsEnglish(e.target.files?.[0]);
        addImageEnglish(testUrl)
      }
    };




    
  const addLink = () => {
    if (linkUrl) {
      editor!.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
    } else {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run()
    }
  }
  
    const addImage = useCallback((url: string) => {
      // const url = window.prompt('URL')
  
      if (url) {
        editor!.chain().focus().setImage({ src: url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${url}` : url }).run()
      }
    }, [editor])
  
    const addYoutubeVideo = () => {
      if (youtubeUrl) {
        editor!.chain().focus().setYoutubeVideo({ src: youtubeUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${youtubeUrl}` : youtubeUrl }).run()
        setYoutubeUrl("")
      }
    }

    const insertTable = () => {
      editor!.chain().focus().insertTable({ rows: tableSize.rows, cols: tableSize.cols, withHeaderRow: true }).run()
    }
    
    async function handleImageUploadContentNews (file: File): Promise<string> {
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);
  
          const url = await uploadNewsImage(formData);
          return url
          } catch (error) {
            return ''
        }
      }
      return '';
    };

  
    const handleFileChangeTiptap = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        let testUrl = await handleImageUploadContentNews(e.target.files?.[0]);
        addImage(testUrl)
      }
    };


if (!editor || !editorEnglish) return null

  return (  
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description='' />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-lg">
              <div className="text-left font-bold pb-2">Cover Image</div>
              <div className="flex space-x-4 justify-between items-center">
                {newsImage && newsImage.url !== '' && (
                  <Image alt={title} src={newsImage.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${newsImage.url}` : newsImage.url} width={200} height={200} className="w-52 h-fit" priority/>
                )}
                {newsImage && newsImage.url === '' && (
                <Input
                  id={`file`}
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={(e) =>
                    e.target.files && handleFileChange(e) // Ensure your file upload function can handle image files
                  }
                  required
                  disabled={loading}
                  className="border border-gray-300 p-2 rounded-md"
                />
                )}
                 {newsImage && newsImage.url !== '' && (
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base flex gap-2">
                        Title (Indonesia) - Max {maxTitleLength} huruf.
                        <div className={`font-normal ${form.watch("title").length > maxTitleLength ? 'text-primary' : ''}`}>Now: {form.watch("title").length}</div>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Judul Berita" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="title_english"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base flex gap-2">
                        Title (English) - Max {maxTitleLength} character.
                        <div className={`font-normal ${form.watch("title_english").length > maxTitleLength ? 'text-primary' : ''}`}>Now: {form.watch("title_english").length}</div>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="News Title" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="py-2">
                <Label className="block p-0 font-bold pb-3 text-base">Publication Date</Label>
                <Popover>
                  <PopoverTrigger asChild className="flex">
                    <Button
                      variant={"outline"}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border shadow-xs"
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
           
            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className=" hidden">
                  <FormLabel>Content (HTML format)</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="Enter news content in HTML format" className="min-h-[200px]" {...field} value={'-'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem className=" hidden">
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter Link Here" {...field} value={'-'}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="link_placeholder"
              render={({ field }) => (
                <FormItem className=" hidden">
                  <FormLabel>Placeholder For Your Link</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Add a Placeholder For Your Link" {...field} value={'-'}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             */}


            <div className="border rounded-lg p-4 shadow-lg gap-4">
              <div className="font-bold mb-2">Content (Indonesia)</div>
              {/* Toolbar */}
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
                  pressed={editor.isActive('underline')}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon className="w-4 h-4" />
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Toggle
                      pressed={editor.isActive('link')}
                    >
                      <LinkLucide className="w-4 h-4" />
                    </Toggle>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">Add a link</p>
                      <div className="flex space-x-2">
                        <Input placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                        <Button onClick={addLink}>Add</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>                
                <Toggle
                  pressed={!editor.isActive('link')}
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                    <UnlinkLucide className="w-4 h-4" />
                </Toggle>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Upload from device</p>
                        <Input  
                          id={`file`}
                          type="file"
                          accept="image/*"
                          name="file"
                          onChange={(e) =>
                            e.target.files && handleFileChangeTiptap(e)
                          }
                          className="border border-gray-300 p-2 rounded-md"
                        />
                      </div>
                      {/* <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2">Or add from URL</p>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                          />
                          <Button onClick={() => addImage}>Add</Button>
                        </div>
                      </div> */}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <YoutubeIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">Add a YouTube video</p>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                        />
                        <Button onClick={addYoutubeVideo}>Add</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Table Controls */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn(editor.isActive("table") ? "bg-muted" : "")}>
                      <TableIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Insert Table</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSize({ ...tableSize, rows: Math.max(2, tableSize.rows - 1) })}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{tableSize.rows}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSize({ ...tableSize, rows: Math.min(10, tableSize.rows + 1) })}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm">×</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSize({ ...tableSize, cols: Math.max(2, tableSize.cols - 1) })}
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{tableSize.cols}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSize({ ...tableSize, cols: Math.min(10, tableSize.cols + 1) })}
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full" onClick={insertTable}>
                        Insert Table
                      </Button>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().addColumnBefore().run()}
                      disabled={!editor.can().addColumnBefore()}
                    >
                      <GripVertical className="h-4 w-4 mr-2" />
                      Add Column Before
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().addColumnAfter().run()}
                      disabled={!editor.can().addColumnAfter()}
                    >
                      <GripVertical className="h-4 w-4 mr-2" />
                      Add Column After
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().deleteColumn().run()}
                      disabled={!editor.can().deleteColumn()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Column
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().addRowBefore().run()}
                      disabled={!editor.can().addRowBefore()}
                    >
                      <GripHorizontal className="h-4 w-4 mr-2" />
                      Add Row Before
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      disabled={!editor.can().addRowAfter()}
                    >
                      <GripHorizontal className="h-4 w-4 mr-2" />
                      Add Row After
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      disabled={!editor.can().deleteRow()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Row
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().deleteTable().run()}
                      disabled={!editor.can().deleteTable()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Table
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().mergeCells().run()}
                      disabled={!editor.can().mergeCells()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Merge Cells
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor.chain().focus().splitCell().run()}
                      disabled={!editor.can().splitCell()}
                    >
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Split Cell
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}

                <div className="ml-auto flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <EditorContent editor={editor} className="border p-4"/>
            </div>



            <div className="border rounded-lg p-4 shadow-lg gap-4">
              <div className="font-bold mb-2">Content (English)</div>
              {/* Toolbar */}
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
                  pressed={editorEnglish.isActive('underline')}
                  onClick={() => editorEnglish.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon className="w-4 h-4" />
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Toggle
                      pressed={editorEnglish.isActive('link')}
                    >
                      <LinkLucide className="w-4 h-4" />
                    </Toggle>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">Add a link</p>
                      <div className="flex space-x-2">
                        <Input placeholder="https://example.com" value={linkUrlEnglish} onChange={(e) => setLinkUrlEnglish(e.target.value)} />
                        <Button onClick={addLinkEnglish}>Add</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>                
                <Toggle
                  pressed={!editorEnglish.isActive('link')}
                  onClick={() => editorEnglish.chain().focus().unsetLink().run()}
                >
                    <UnlinkLucide className="w-4 h-4" />
                </Toggle>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Upload from device</p>
                        <Input  
                          id={`file`}
                          type="file"
                          accept="image/*"
                          name="file"
                          onChange={(e) =>
                            e.target.files && handleFileChangeTiptapEnglish(e)
                          }
                          className="border border-gray-300 p-2 rounded-md"
                        />
                      </div>
                      {/* <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2">Or add from URL</p>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={imageUrlEnglish}
                            onChange={(e) => setImageUrlEnglish(e.target.value)}
                          />
                          <Button onClick={() => addImageEnglish}>Add</Button>
                        </div>
                      </div> */}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <YoutubeIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">Add a YouTube video</p>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrlEnglish(e.target.value)}
                        />
                        <Button onClick={addYoutubeVideoEnglish}>Add</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Table Controls */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn(editorEnglish.isActive("table") ? "bg-muted" : "")}>
                      <TableIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Insert Table</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSizeEnglish({ ...tableSizeEnglish, rows: Math.max(2, tableSizeEnglish.rows - 1) })}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{tableSizeEnglish.rows}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSizeEnglish({ ...tableSizeEnglish, rows: Math.min(10, tableSizeEnglish.rows + 1) })}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm">×</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSizeEnglish({ ...tableSizeEnglish, cols: Math.max(2, tableSizeEnglish.cols - 1) })}
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{tableSizeEnglish.cols}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setTableSizeEnglish({ ...tableSizeEnglish, cols: Math.min(10, tableSizeEnglish.cols + 1) })}
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full" onClick={insertTableEnglish}>
                        Insert Table
                      </Button>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().addColumnBefore().run()}
                      disabled={!editorEnglish.can().addColumnBefore()}
                    >
                      <GripVertical className="h-4 w-4 mr-2" />
                      Add Column Before
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().addColumnAfter().run()}
                      disabled={!editorEnglish.can().addColumnAfter()}
                    >
                      <GripVertical className="h-4 w-4 mr-2" />
                      Add Column After
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().deleteColumn().run()}
                      disabled={!editorEnglish.can().deleteColumn()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Column
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().addRowBefore().run()}
                      disabled={!editorEnglish.can().addRowBefore()}
                    >
                      <GripHorizontal className="h-4 w-4 mr-2" />
                      Add Row Before
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().addRowAfter().run()}
                      disabled={!editorEnglish.can().addRowAfter()}
                    >
                      <GripHorizontal className="h-4 w-4 mr-2" />
                      Add Row After
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().deleteRow().run()}
                      disabled={!editorEnglish.can().deleteRow()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Row
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().deleteTable().run()}
                      disabled={!editorEnglish.can().deleteTable()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Table
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().mergeCells().run()}
                      disabled={!editorEnglish.can().mergeCells()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Merge Cells
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editorEnglish.chain().focus().splitCell().run()}
                      disabled={!editorEnglish.can().splitCell()}
                    >
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Split Cell
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}

                <div className="ml-auto flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editorEnglish.chain().focus().undo().run()}
                    disabled={!editorEnglish.can().undo()}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editorEnglish.chain().focus().redo().run()}
                    disabled={!editorEnglish.can().redo()}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <EditorContent editor={editorEnglish} className="border p-4"/>
            </div>



          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

