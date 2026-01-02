'use client';

import * as React from 'react';
import {
  ArrowLeftRight,
  CircleDollarSign,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Send,
  Settings2,
  Wallet,
} from 'lucide-react';

import { Link, linkOptions } from '@tanstack/react-router';
import { NavMain } from '@/components/navbar/nav-main';
import { NavSecondary } from '@/components/navbar/nav-secondary';
import { NavUser } from '@/components/navbar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  navMain: [
    linkOptions({
      label: 'Inicio',
      to: '/dashboard',
      activeOptions: { exact: true },
      icon: Home,
    }),
    linkOptions({
      label: 'Transacciones',
      to: '/dashboard/transactions',
      icon: ArrowLeftRight,
    }),
    linkOptions({
      label: 'Cuentas',
      to: '/dashboard/accounts',
      icon: Wallet,
    }),
    linkOptions({
      label: 'Categorias',
      to: '/dashboard/categories',
      icon: LayoutDashboard,
    }),
    linkOptions({
      label: 'Ajustes',
      to: '/dashboard/settings',
      icon: Settings2,
    }),
  ],
  navSecondary: [
    linkOptions({
      label: 'Soporte',
      to: '/dashboard/settings',
      icon: LifeBuoy,
    }),
    linkOptions({
      label: 'Feedback',
      to: '/dashboard/settings',
      icon: Send,
    }),
  ],
};

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
  );
}
