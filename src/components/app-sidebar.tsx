"use client"

import * as React from "react"
import {
  CircleDollarSign,
  Home,
  LifeBuoy,
  Send,
  Settings2,
  Users2,
} from "lucide-react"

import { Link   } from "@tanstack/react-router"
import type { LinkProps } from "@tanstack/react-router";
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Item = {
  title: string;
  url: LinkProps['to'];
  icon: React.ForwardRefExoticComponent<any>,
  isActive?: boolean;
}

type Options = {
  navMain: Array<Item>;
  navSecondary: Array<Item>
}

const data: Options = {
  navMain: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Usuarios",
      url: "/dashboard/users",
      icon: Users2,
    },
    {
      title: "Ajustes",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Soporte",
      url: "/dashboard",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/dashboard",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <CircleDollarSign className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Famotra</span>
                  <span className="truncate text-xs">Money Tracker</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
