import { Link } from '@tanstack/react-router';
import type { LinkOptions } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

type Items = (LinkOptions & {
  icon: LucideIcon;
  label: string;
})[];

export function NavAdmin({ items }: { items: Items }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administrador</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild tooltip={item.label}>
              <Link to={item.to} {...item} activeProps={{ className: 'bg-muted' }}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
