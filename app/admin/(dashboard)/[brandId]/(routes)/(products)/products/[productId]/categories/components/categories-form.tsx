"use client"

import axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { ChevronsUpDown, Trash, } from "lucide-react"
import { AllCategory, AllProductCategory, Product } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { Heading } from "@/app/admin/components/ui/heading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/admin/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/admin/components/ui/command"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
 
interface AllProductCategoryFormProps {
  initialData: AllProductCategory[];
  categories: AllCategory[];
  subcategories: AllCategory[];
  subsubcategories: AllCategory[];
  series: AllCategory[];
  myproduct: Product;
};


export const AllProductCategoryForm: React.FC<AllProductCategoryFormProps> = ({
  initialData,
  categories,
  subcategories,
  subsubcategories,
  series,
  myproduct,
}) => {
  const [allSelectedCategories, setAllSelectedCategories] = useState<AllCategory[]>([]);
  const [allSelectedSubCategories, setAllSelectedSubCategories] = useState<AllCategory[]>([]);
  const [allSelectedSubSubCategories, setAllSelectedSubSubCategories] = useState<AllCategory[]>([]);
  const [allSelectedSeries, setAllSelectedSeries] = useState<AllCategory[]>([]);

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [openSubCat, setOpenSubCat] = useState(false);
  const [openSubSubCat, setOpenSubSubCat] = useState(false);
  const [openSeries, setOpenSeries] = useState(false);

  const title = initialData.length > 0 ? `Edit Categories` : `Add Categories`;
  const description = `For ${myproduct.name}`;
  const toastMessage = initialData.length > 0 ? 'Categories updated.' : 'Categories created.';
  const action = initialData.length > 0 ? 'Save changes' : 'Create';

  useEffect(() => {
    if(initialData.length > 0 && myproduct){
      let tempcat: AllCategory[] = [];
      let tempsubcat: AllCategory[] = [];
      let tempsubsubcat: AllCategory[] = [];
      let tempseries: AllCategory[] = [];
      initialData.forEach((item) => {
        const category: AllCategory = {
          id: item.categoryId,
          brandId: myproduct.brandId,
          type: item.type,
          name: item.name,
          slug: item.slug,
          description: '',
          thumbnail_url: '',
          updatedBy: '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
        
        if (item.type === "Category") {
          tempcat.push(category);
        } else if (item.type === "Sub Category") {
          tempsubcat.push(category);
        } else if (item.type === "Sub Sub Category") {
          tempsubsubcat.push(category);
        } else if (item.type === "Series") {
          tempseries.push(category);
        }
      });
      setAllSelectedCategories(tempcat)
      setAllSelectedSubCategories(tempsubcat)
      setAllSelectedSubSubCategories(tempsubsubcat)
      setAllSelectedSeries(tempseries)
    }
  }, [initialData, myproduct]);

  function deleteSelectedCat(id: String){
    setAllSelectedCategories(allSelectedCategories.filter(item => item.id !== id))
  }
  
  function addSelectedCat(data: String){
    const foundCategory = categories.find(item => item.id === data);
    if (foundCategory) {
      const found = allSelectedCategories.some(item => item.slug === foundCategory.slug);
      if (found) {
        toast.error('Item already selected.');
      } else {
        setAllSelectedCategories(prevCategories => [...prevCategories, foundCategory]);
      }
    } else {
      console.log("No category found with the specified name.");
    }
  }

  function deleteSelectedSubCat(id: String){
    setAllSelectedSubCategories(allSelectedSubCategories.filter(item => item.id !== id))
  }
  
  function addSelectedSubCat(data: String){
    const foundSubCategory = subcategories.find(item => item.id === data);
    if (foundSubCategory) {
      const found = allSelectedSubCategories.some(item => item.slug === foundSubCategory.slug);
      if (found) {
        toast.error('Item already selected.');
      } else {
        setAllSelectedSubCategories(prevCategories => [...prevCategories, foundSubCategory]);
      }
    } else {
      console.log("No sub category found with the specified name.");
    }
  }

  function deleteSelectedSubSubCat(id: String){
    setAllSelectedSubSubCategories(allSelectedSubSubCategories.filter(item => item.id !== id))
  }
  
  function addSelectedSubSubCat(data: String){
    const foundSubSubCategory = subsubcategories.find(item => item.id === data);
    if (foundSubSubCategory) {
      const found = allSelectedSubSubCategories.some(item => item.slug === foundSubSubCategory.slug);
      if (found) {
        toast.error('Item already selected.');
      } else {
        setAllSelectedSubSubCategories(prevCategories => [...prevCategories, foundSubSubCategory]);
      }
    } else {
      console.log("No sub sub category found with the specified name.");
    }
  }

  function deleteSelectedSeries(id: String){
    setAllSelectedSeries(allSelectedSeries.filter(item => item.id !== id))
  }
  
  function addSelectedSeries(data: String){
    const foundSeries = series.find(item => item.id === data);
    if (foundSeries) {
      const found = allSelectedSeries.some(item => item.slug === foundSeries.slug);
      if (found) {
        toast.error('Item already selected.');
      } else {
        setAllSelectedSeries(prevCategories => [...prevCategories, foundSeries]);
      }
    } else {
      console.log("No series found with the specified name.");
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const allSelected: AllCategory[] = [...allSelectedCategories, ...allSelectedSubCategories, ...allSelectedSubSubCategories, ...allSelectedSeries];
    try {
      setLoading(true);
      let response: AxiosResponse;
      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_PRODUCT_CATEGORY}`;
      //@ts-ignore
      const API_EDITED = API.replace('{brandId}', params.brandId)
      //@ts-ignore
      const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
      if (initialData.length > 0) {
        response = await axios.patch(API_EDITED2, allSelected);
      } else {
        response = await axios.post(API_EDITED2, allSelected);
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

  
  const formattedCat = categories.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const formattedSubCat = subcategories.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const formattedSubSubCat = subsubcategories.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const formattedSeries = series.map((item) => ({
    label: item.name,
    value: item.id
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      
      <div>
        <div className="md:grid md:grid-cols-2 gap-4">

          <div className="border rounded-lg p-4 shadow-lg">
            <div className="font-bold mb-2">Selected Categories</div>
            <Popover open={openCat} onOpenChange={setOpenCat}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={openCat}
                  aria-label="Select a Brand"
                  className={cn("w-[200px] justify-between")}
                >
                  Select
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search Category..." />
                    <CommandEmpty>No Category found.</CommandEmpty>
                    <CommandGroup>
                      {formattedCat.map((cat) => (
                        <CommandItem
                          key={cat.value}
                          onSelect={() => {
                            addSelectedCat(cat.value);
                            setOpenCat(false);
                          }}
                          className="text-sm"
                        >
                          {cat.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-1 justify-between">
              {allSelectedCategories?.map((categories) => (
                  <div key={categories.name} className="flex items-center justify-between py-2 border-b px-2">
                    <div className="font-medium">{categories.name}</div>
                    <div>
                      <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSelectedCat(categories.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-lg">
            <div className="font-bold mb-2">Selected Sub Categories</div>
            <Popover open={openSubCat} onOpenChange={setOpenSubCat}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={openSubCat}
                  aria-label="Select a Sub Category"
                  className={cn("w-[200px] justify-between")}
                >
                  Select
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search Sub Category..." />
                    <CommandEmpty>No Sub Category found.</CommandEmpty>
                    <CommandGroup>
                      {formattedSubCat.map((subcat) => (
                        <CommandItem
                          key={subcat.value}
                          onSelect={() => {
                            addSelectedSubCat(subcat.value);
                            setOpenSubCat(false);
                          }}
                          className="text-sm"
                        >
                          {subcat.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-1 justify-between">
              {allSelectedSubCategories?.map((subcategories) => (
                  <div key={subcategories.name} className="flex items-center justify-between py-2 border-b px-2">
                    <div className="font-medium">{subcategories.name}</div>
                    <div>
                      <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSelectedSubCat(subcategories.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-lg">
            <div className="font-bold mb-2">Selected Sub Sub Categories</div>
            <Popover open={openSubSubCat} onOpenChange={setOpenSubSubCat}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={openSubSubCat}
                  aria-label="Select a Sub Sub Category"
                  className={cn("w-[200px] justify-between")}
                >
                  Select
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search Sub Sub Category..." />
                    <CommandEmpty>No Sub Sub Category found.</CommandEmpty>
                    <CommandGroup>
                      {formattedSubSubCat.map((subsubcat) => (
                        <CommandItem
                          key={subsubcat.value}
                          onSelect={() => {
                            addSelectedSubSubCat(subsubcat.value);
                            setOpenSubSubCat(false);
                          }}
                          className="text-sm"
                        >
                          {subsubcat.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-1 justify-between">
              {allSelectedSubSubCategories?.map((subsubcategories) => (
                  <div key={subsubcategories.name} className="flex items-center justify-between py-2 border-b px-2">
                    <div className="font-medium">{subsubcategories.name}</div>
                    <div>
                      <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSelectedSubSubCat(subsubcategories.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
      
          <div className="border rounded-lg p-4 shadow-lg">
            <div className="font-bold mb-2">Selected Series</div>
            <Popover open={openSeries} onOpenChange={setOpenSeries}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={openSeries}
                  aria-label="Select a Series"
                  className={cn("w-[200px] justify-between")}
                >
                  Select
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search Series..." />
                    <CommandEmpty>No Series found.</CommandEmpty>
                    <CommandGroup>
                      {formattedSeries.map((series) => (
                        <CommandItem
                          key={series.value}
                          onSelect={() => {
                            addSelectedSeries(series.value);
                            setOpenSeries(false);
                          }}
                          disabled={false}
                          className="text-sm"
                        >
                          {series.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-1 justify-between">
              {allSelectedSeries?.map((series) => (
                  <div key={series.name} className="flex items-center justify-between py-2 border-b px-2">
                    <div className="font-medium">{series.name}</div>
                    <div>
                      <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSelectedSeries(series.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
      <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
        {action}
      </Button>
    </form>
    </>
  );
};
