import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { CreateEditSubscriptionDialog } from '../components/add-subscription-dialog';
import { subscriptionsQueryOptions } from '../query-options/subscriptions';
import {
  Calendar,
  CalendarIcon,
  Filter,
  LaptopMinimalCheck,
  ListFilter,
  Plus,
  SortAsc,
  SquareChartGantt,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SubscriptionsPage() {
  const {
    data: subscriptions,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(subscriptionsQueryOptions);
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Gestión de Suscripciones</h2>
            <p className="text-muted-foreground">
              Administra y controla tus gastos fijos recurrentes.
            </p>
          </div>
          <CreateEditSubscriptionDialog>
            <Button type="button">
              <Plus />
              Nueva Suscripción
            </Button>
          </CreateEditSubscriptionDialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Gasto Mensual
              </h3>
              <Calendar />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">$320.50</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-500 flex items-center gap-1">
                  <TrendingUp />
                  +2.4%
                </span>
                vs mes anterior
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Anual Proyectado
              </h3>
              <SquareChartGantt />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">$3,846.00</div>
              <p className="text-xs text-muted-foreground mt-1">Basado en suscripciones activas</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Próximo Pago
              </h3>
              <LaptopMinimalCheck />
            </div>
            <div className="p-6 pt-0 space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xl font-bold">Netflix</div>
                  <p className="text-xs text-muted-foreground">Mañana, 24 Oct</p>
                </div>
                <div className="text-sm font-medium text-primary">85%</div>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="xl:col-span-2 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold leading-none tracking-tight">Mis Suscripciones</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gestiona los detalles de tus servicios activos.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-2">
                  <ListFilter />
                  Filtros
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-2">
                  <SortAsc size={20} />
                  Ordenar
                </button>
              </div>
            </div>

            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b [&_tr]:border-border">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[250px]">
                      Servicio
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Categoría
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Costo
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Frecuencia
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Próximo
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#E50914] flex items-center justify-center text-white font-bold text-xs">
                          N
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Netflix Premium</span>
                          <span className="text-xs text-muted-foreground">Plan 4K HDR</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        Streaming
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">$15.99</td>
                    <td className="p-4 align-middle text-muted-foreground">Mensual</td>
                    <td className="p-4 align-middle">Oct 24, 2023</td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-transparent bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 transition-colors">
                        Activo
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#1DB954] flex items-center justify-center text-white font-bold text-xs">
                          S
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Spotify Duo</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        Música
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">$12.99</td>
                    <td className="p-4 align-middle text-muted-foreground">Mensual</td>
                    <td className="p-4 align-middle">Oct 28, 2023</td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-transparent bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 transition-colors">
                        Activo
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#0061F2] flex items-center justify-center text-white font-bold text-xs">
                          D
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Dropbox Pro</span>
                          <span className="text-xs text-muted-foreground">2TB Storage</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        Software
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">$119.88</td>
                    <td className="p-4 align-middle text-muted-foreground">Anual</td>
                    <td className="p-4 align-middle">Nov 15, 2023</td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-transparent bg-yellow-500/15 px-2.5 py-0.5 text-xs font-semibold text-yellow-500 transition-colors">
                        Pausado
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          A
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Adobe CC</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        Diseño
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">$54.99</td>
                    <td className="p-4 align-middle text-muted-foreground">Mensual</td>
                    <td className="p-4 align-middle">Nov 01, 2023</td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-transparent bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 transition-colors">
                        Activo
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#FF9900] flex items-center justify-center text-white font-bold text-xs">
                          <span className="material-symbols-outlined text-[16px]">
                            fitness_center
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Golds Gym</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        Salud
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">$39.99</td>
                    <td className="p-4 align-middle text-muted-foreground">Mensual</td>
                    <td className="p-4 align-middle">Nov 05, 2023</td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border border-transparent bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 transition-colors">
                        Activo
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t border-border">
              <div className="flex-1 text-sm text-muted-foreground">1 de 5 páginas</div>
              <div className="space-x-2">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-4"
                  disabled
                >
                  Anterior
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-4">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
