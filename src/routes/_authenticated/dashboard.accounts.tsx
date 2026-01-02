import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NumericFormat } from 'react-number-format';
import { accountsQueryOptions } from '@/query-options/accounts';
import { AccountCard } from '@/components/account-card';
import { CreateEditAccountDialog } from '@/components/create-edit-account';
import { AddAcountCard } from '@/components/add-account';

export const Route = createFileRoute('/_authenticated/dashboard/accounts')({
  beforeLoad: () => ({
    breadcrumb: 'Cuentas',
  }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(accountsQueryOptions);
  },
  component: Accounts,
});

function Accounts() {
  const { data } = useSuspenseQuery(accountsQueryOptions);
  const accounts = data.accounts;
  const totalBalance = data.total;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Cuentas
          </h1>
          <p className="py-4 text-muted-foreground text-sm">Controla y administra tus cuentas</p>
          <div className="mt-4 rounded-lg bg-card p-4 shadow-sm">
            <h4 className="text-sm text-muted-foreground">Balance total</h4>
            <p className="text-2xl font-bold mt-2">
              <NumericFormat
                value={totalBalance}
                prefix="$ "
                thousandSeparator="."
                decimalSeparator=","
                displayType="text"
              />
            </p>
          </div>
        </header>
        <div className="grid gap-5">
          {accounts.map((account) => {
            return <AccountCard account={account} key={account.id}></AccountCard>;
          })}
          <CreateEditAccountDialog>
            <AddAcountCard />
          </CreateEditAccountDialog>
        </div>
      </div>
    </div>
  );
}
