import prismadb from "@/lib/prismadb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/admin/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MainNav } from "@/app/admin/components/main-nav";
import LogoutButton from "@/app/admin/components/logout-button";
import { Brand } from "@prisma/client";
import { getSession } from "../actions";
import { redirect } from "next/navigation";
import Link from "next/link";

const Navbar = async () => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }
  let authorizedBrands: Brand[] = []
  if(session.isAdmin){
    const brands = await prismadb.brand.findMany({});
    authorizedBrands = brands
  }
  else{
    const brands = await prismadb.brand.findMany({
      where: {
        id: {
          in: session.authorizedBrands, // Adjusted to use the 'in' operator
        },
      },
    });
    authorizedBrands = brands
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="px-4">
          <Link href={'/admin'}>
            <Image src={'/images/acr/logo_acr.webp'} width={100} height={100} alt="Logo ACR" className="w-24 h-fit"/>
          </Link>
        </div>
        <MainNav className="mx-6" isadmin={session.isAdmin!}/>
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="mr-4">
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/profile.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hello, {session.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;