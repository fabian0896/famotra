import * as React from 'react';
import {
  ArrowLeftRight,
  CircleDollarSign,
  Home,
  LandmarkIcon,
  LayoutDashboard,
  LifeBuoy,
  Send,
  Settings2,
  SmartphoneIcon,
  StoreIcon,
  UsersIcon,
  Wallet,
} from 'lucide-react';

import { Link, linkOptions } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NavAdmin } from './nav-admin';
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
import { authQueryOptions } from '@/modules/auth/query-options/auth';

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
      label: 'Atajos (IOS)',
      to: '/dashboard/shortcuts',
      icon: SmartphoneIcon,
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

const adminMenu = [
  linkOptions({
    label: 'Usuarios',
    to: '/dashboard/admin/users',
    activeOptions: { exact: true },
    icon: UsersIcon,
  }),
  linkOptions({
    label: 'Bancos',
    to: '/dashboard/admin/banks',
    icon: LandmarkIcon,
  }),
  linkOptions({
    label: 'Comercios',
    to: '/dashboard/admin/merchants',
    icon: StoreIcon,
  }),
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: auth } = useSuspenseQuery(authQueryOptions);
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
                  <span className="truncate text-xs">Control de gastos</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {auth?.profile.role === 'admin' ? <NavAdmin items={adminMenu} /> : null}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
