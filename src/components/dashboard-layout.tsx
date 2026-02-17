import { Link, Outlet, useMatchRoute } from '@tanstack/react-router';
import { HomeIcon, LayoutDashboardIcon, MenuIcon, PlusIcon, WalletIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: HomeIcon, label: 'Home' },
  { to: '/dashboard/categories', icon: LayoutDashboardIcon, label: 'Categorias' },
  { to: '/dashboard/accounts', icon: WalletIcon, label: 'Cuentas' },
  { to: '/dashboard/settings', icon: MenuIcon, label: 'Menu' },
] as const;

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

function AddButton() {
  return (
    <Link
      to="/dashboard/transactions"
      className="size-16 grid place-items-center bg-linear-to-br from-primary to-primary/60 rounded-full shadow-2xl shadow-primary/60"
    >
      <PlusIcon className="text-primary-foreground size-[26px] stroke-3" />
    </Link>
  );
}

export function Header({
  title = 'Famotra',
  action,
}: {
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="px-6 py-5 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      {action ?? <button className="w-12 h-12 bg-card border border-border rounded-full"></button>}
    </header>
  );
}

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
    <footer className="fixed bottom-0 inset-x-0 pb-4 px-4">
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

export function DashboardLayout() {
  return (
    <div className="min-h-screen pb-28">
      <Outlet />
      <BottomNav />
    </div>
  );
}
