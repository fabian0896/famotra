import * as React from 'react';
import { Separator } from '@radix-ui/react-separator';
import { Link, Outlet, createFileRoute, isMatch, useMatches } from '@tanstack/react-router';
import { AppSidebar } from '@/components/navbar/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const matches = useMatches();

  const matchesWithCrumbs = matches
    .filter((match) => isMatch(match, 'context.breadcrumb'))
    .map((b, idx, list) => ({
      title: b.context.breadcrumb,
      path: b.pathname,
      actual: idx === list.length - 1,
    }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {matchesWithCrumbs.map((bread, idx) =>
                  bread.actual ? (
                    <BreadcrumbItem key={idx}>
                      <BreadcrumbPage>{bread.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <React.Fragment key={idx}>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink asChild>
                          <Link to={bread.path}>{bread.title}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </React.Fragment>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 p-8 pb-10 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
