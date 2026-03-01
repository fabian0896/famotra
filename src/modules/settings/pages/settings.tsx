import {
  ArrowLeftRightIcon,
  BarChart3Icon,
  ChevronRight,
  LogOutIcon,
  RepeatIcon,
  TargetIcon,
  UserIcon,
  ZapIcon,
} from 'lucide-react';
import { Link, useRouter } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Auth } from '@/modules/auth/services/auth';
import { Content, Footer, Header, Page } from '@/components/dashboard-layout';

const MENU_ITEMS = [
  {
    icon: ArrowLeftRightIcon,
    title: 'Transacciones',
    description: 'Registra y gestiona tus movimientos',
    to: '/dashboard/transactions',
  },
  {
    icon: RepeatIcon,
    title: 'Suscripciones',
    description: 'Controla tus pagos recurrentes',
    to: '/dashboard/transactions',
  },
  {
    icon: TargetIcon,
    title: 'Presupuestos',
    description: 'Define límites para tu gasto',
    to: '/dashboard/transactions',
  },
  {
    icon: BarChart3Icon,
    title: 'Reportes',
    description: 'Analiza tus finanzas',
    to: '/dashboard/transactions',
  },
];

export function Settingspage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useMutation({
    mutationFn: Auth.logout,
    onSuccess: () => {
      queryClient.clear();
      router.navigate({ to: '/' });
    },
  });

  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Menu</Header.Title>
      </Header>

      <Content className="flex flex-col gap-7">
        <div className="pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Control</h3>
          <div className="grid grid-cols-2 gap-3">
            {MENU_ITEMS.map(({ icon: Icon, title, description, to }) => (
              <Link key={title} to={to} className="bg-card p-5 rounded-2xl flex flex-col gap-3.5">
                <div className="size-11 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{title}</p>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Ajustes</h3>
          <ul className="bg-card rounded-2xl p-1 divide-y divide-border">
            <li className="block">
              <Link className="p-4 flex items-center gap-3.5" to="/dashboard/shortcuts">
                <ZapIcon className="size-5 text-muted-foreground" />
                <p className="flex-1 text-base text-foreground font-medium">Atajos</p>
                <ChevronRight className="size-4.5 text-muted-foreground/50" />
              </Link>
            </li>
            <li className="p-4 flex items-center gap-3.5">
              <UserIcon className="size-5 text-muted-foreground" />
              <p className="flex-1 text-base text-foreground font-medium">Perfil</p>
              <ChevronRight className="size-4.5 text-muted-foreground/50" />
            </li>
            <li className="block">
              <button
                className="w-full p-4 flex items-center gap-3.5"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOutIcon className="size-5 text-destructive" />
                <p className="flex-1 text-left text-base text-destructive font-medium">
                  Cerrar sesión
                </p>
              </button>
            </li>
          </ul>
        </div>
      </Content>

      <Footer.Hide />
    </Page>
  );
}
