import { createFileRoute } from '@tanstack/react-router';
import { LucidePlus } from 'lucide-react';
import { Card, CardDescription } from '@/components/ui/card';

export const Route = createFileRoute('/_authenticated/dashboard/accounts')({
  beforeLoad: () => ({
    breadcrumb: 'Cuentas',
  }),
  component: Accounts,
});

function Accounts() {
  return (
    <div className="container mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Cuentas</h1>
      <h2 className="py-4 text-muted-foreground text-sm">Controla y administra tus cuentas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="items-center rounded-sm gap-3">
          <button className="h-16 w-16 rounded-full bg-primary-foreground flex transition-all justify-center items-center hover:scale-105">
            <LucidePlus className="text-primary" size={30} strokeWidth={3} />
          </button>
          <CardDescription>Agregar cuenta</CardDescription>
        </Card>
      </div>
    </div>
  );
}
