import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { accountsQueryOptions } from '@/query-options/accounts';
import { AccountCard } from '@/components/account-card';
import { CreateEditAccountDialog } from '@/components/create-edit-account';
import { banksQueryOptions } from '@/query-options/banks';
import { AddAcountCard } from '@/components/add-account';

export const Route = createFileRoute('/_authenticated/dashboard/accounts')({
  beforeLoad: () => ({
    breadcrumb: 'Cuentas',
  }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(accountsQueryOptions);
    await queryClient.ensureQueryData(banksQueryOptions);
  },
  component: Accounts,
});

function Accounts() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl">
        <header>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Cuentas
          </h1>
          <p className="py-4 text-muted-foreground text-sm">Controla y administra tus cuentas</p>
        </header>
        <div className="grid gap-5">
          <CreateEditAccountDialog>
            <AddAcountCard />
          </CreateEditAccountDialog>
          {accounts.map((account) => {
            return <AccountCard account={account} key={account.id}></AccountCard>;
          })}
        </div>
      </div>
    </div>
  );
}
