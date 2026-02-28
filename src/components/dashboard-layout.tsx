import { Link, Outlet, useMatchRoute, useRouter } from '@tanstack/react-router';
import {
  ChevronLeftIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PlusIcon,
  WalletIcon,
} from 'lucide-react';
import { tv } from 'tailwind-variants';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Spinner } from './ui/spinner';
import type { VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: HomeIcon, label: 'Home' },
  { to: '/dashboard/categories', icon: LayoutDashboardIcon, label: 'Categorias' },
  { to: '/dashboard/accounts', icon: WalletIcon, label: 'Cuentas' },
  { to: '/dashboard/settings', icon: MenuIcon, label: 'Menu' },
] as const;

function AddButton() {
  return (
    <Link
      to="/dashboard/transactions/new"
      className="size-16 grid place-items-center bg-linear-to-br from-primary to-primary/60 rounded-full shadow-2xl shadow-primary/60"
    >
      <PlusIcon className="text-primary-foreground size-[26px] stroke-3" />
    </Link>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}) {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: to !== '/dashboard' });

  return (
    <Link
      to={to}
      className="w-[52px] flex gap-1 items-center justify-center flex-col rounded-lg px-2 py-1"
    >
      <Icon className={cn('size-[22px]', isActive ? 'text-primary' : 'text-muted-foreground')} />
      <span
        className={cn(
          'text-[10px] font-semibold',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function Page({
  children,
  onRefresh,
}: {
  children: React.ReactNode;
  onRefresh?: () => Promise<unknown>;
}) {
  if (onRefresh) {
    return (
      <PullToRefresh
        pullingContent={
          <p className="text-xs text-muted-foreground text-center py-2">Arrastra para actualizar</p>
        }
        refreshingContent={
          <div className="py-4 flex justify-center">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        }
        onRefresh={onRefresh}
      >
        {children}
      </PullToRefresh>
    );
  }
  return <>{children}</>;
}

function HeaderRoot({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      className={cn('px-6 py-4 flex justify-between items-center gap-3 min-h-[76px]', className)}
      {...props}
    />
  );
}

function HeaderTitle({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn('text-2xl font-semibold text-foreground flex-1 line-clamp-1', className)}
      {...props}
    />
  );
}

function HeaderActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-2 order-last', className)}
      data-position="actions"
      {...props}
    />
  );
}

const actionButton = tv({
  base: "border rounded-full grid place-items-center active:bg-muted transition-all [&_svg:not([class*='text-'])]:text-muted-foreground",
  variants: {
    variant: {
      default: 'bg-card border-border',
      destructive:
        "bg-red-600/10 border-red-400 active:bg-red-300/10 [&_svg:not([class*='text-'])]:text-red-400",
    },
    size: {
      base: "w-10 h-10 [&_svg:not([class*='size-'])]:size-5",
      sm: "w-9 h-9 [&_svg:not([class*='size-'])]:size-[18px]",
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
  },
});

function HeaderActionButton({
  variant,
  size,
  className,
  asChild = false,
  ...props
}: { asChild?: boolean } & React.ComponentProps<'button'> & VariantProps<typeof actionButton>) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(actionButton({ variant, size }), className)} {...props} />;
}

function BackButton({ ...props }: React.ComponentProps<typeof HeaderActionButton>) {
  const router = useRouter();
  return (
    <HeaderActionButton
      onClick={() => router.history.back()}
      className="order-first"
      size="sm"
      {...props}
    >
      <ChevronLeftIcon className="text-foreground size-5" />
    </HeaderActionButton>
  );
}

export const Header = Object.assign(HeaderRoot, {
  Title: HeaderTitle,
  Actions: HeaderActions,
  ActionButton: HeaderActionButton,
  BackButton: BackButton,
});

export function Content({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={cn('px-6', className)}>{children}</main>;
}

export function BottomNav() {
  const [left, right] = [navItems.slice(0, 2), navItems.slice(2)];

  return (
    <footer className="fixed z-30 bottom-0 inset-x-0 pb-4 px-4 group-has-data-[footer=custom]/layout:hidden">
      <div className="bg-card border border-border rounded-full flex justify-between items-center px-4 h-[58px]">
        {left.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <AddButton />
        {right.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </footer>
  );
}

export function Footer({ className, ...props }: React.ComponentProps<'footer'>) {
  return (
    <footer
      data-footer="custom"
      className={cn(
        'p-6 w-full fixed bottom-0 left-0 bg-linear-to-t from-background from-65%',
        className
      )}
      {...props}
    />
  );
}

export function DashboardLayout() {
  return (
    <div className="min-h-screen pb-28 group/layout">
      <Outlet />
      <BottomNav />
    </div>
  );
}
