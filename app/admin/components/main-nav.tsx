"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/app/admin/components/ui/navigation-menu"
import { useParams } from "next/navigation"
interface MainNavClientProps {
  isadmin: boolean;
}

type MainNavProps = React.HTMLAttributes<HTMLElement> & MainNavClientProps;

export function MainNav({
  isadmin,
  className,
  ...props
}: MainNavProps) {
  const params = useParams();

  const Products: { title: string; href: string; description: string }[] = [
    {
      title: "All Products",
      href: `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/products`,
      description: "Show All Products",
    },
    ...(isadmin
      ? [
          {
            title: "Size",
            href: `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/size`,
            description: "Show All Sizes.",
          },
          {
            title: "Category",
            href: `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/category`,
            description: "Show All Categories.",
          },
          {
            title: "Sub Category",
            href: `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subcategory`,
            description: "Show All Sub Categories.",
          },
          {
            title: "Sub Sub Category",
            href: `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subsubcategory`,
            description: "Show All Sub Sub Categories.",
          },
          {
            title: "Series",
            href: `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/series`,
            description: "Show All Series.",
          },
        ]
      : []),
  ];
  

  return (
    <NavigationMenu>
      <NavigationMenuList>
      <NavigationMenuItem>
          {/* <Link 
          href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}`}
          legacyBehavior passHref> */}
            <NavigationMenuLink href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}`} className={`${navigationMenuTriggerStyle()} hover:text-primary`}>
              Overview
            </NavigationMenuLink>
          {/* </Link> */}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:grid-cols-1 ">
              {Products.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      <NavigationMenuItem>
          {/* <Link 
          href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/news`}
          legacyBehavior passHref> */}
            <NavigationMenuLink href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/news`} className={`${navigationMenuTriggerStyle()}`}>
              News
            </NavigationMenuLink>
          {/* </Link> */}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/hero`} className={`${navigationMenuTriggerStyle()}`}>
            Hero
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Specification</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[150px] gap-3 p-4">
                  <ListItem
                    key={'Parent Specification'}
                    title={'Parent'}
                    href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/parentspec`}>
                  </ListItem>
                  <ListItem
                    key={'Sub Parent Specification'}
                    title={'Sub Parent'}
                    href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subparentspec`}>
                  </ListItem>
                  <ListItem
                    key={'Child Specification'}
                    title={'Child'}
                    href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/childspec`}>
                  </ListItem>
                  <ListItem
                    key={'Specification Priority'}
                    title={'Priority'}
                    href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/spec/priority`}>
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {isadmin? (
          <>
          {/* <NavigationMenuItem>
              <NavigationMenuLink href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/customapi`} className={navigationMenuTriggerStyle()}>
                Custom API
              </NavigationMenuLink>
          </NavigationMenuItem> */}
          <NavigationMenuItem>
              <NavigationMenuLink href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/settings`} className={navigationMenuTriggerStyle()}>
                Brand Settings
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/usersettings`} className={navigationMenuTriggerStyle()}>
                User Settings
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/createuser`} className={navigationMenuTriggerStyle()}>
                Create New User
              </NavigationMenuLink>
          </NavigationMenuItem>
          </>
        ): (
          <></>
        )}
        
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-primary focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
