import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { accountsQueryOptions } from '@/query-options/accounts';
import { authQueryOptions } from '@/query-options/auth';
import { AccountItem } from '@/components/account-item';
import { AddAcount } from '@/components/add-account';

export const Route = createFileRoute('/_authenticated/dashboard/accounts')({
  beforeLoad: () => ({
    breadcrumb: 'Cuentas',
  }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(accountsQueryOptions);
    await queryClient.ensureQueryData(authQueryOptions);
  },
  component: Accounts,
});

function Accounts() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  const { data: user } = useSuspenseQuery(authQueryOptions);
  return (
    <div className="container mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Cuentas</h1>
      <h2 className="py-4 text-muted-foreground text-sm">Controla y administra tus cuentas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AddAcount></AddAcount>
        {accounts.map((account) => (
          <AccountItem account={account} user={user} key={account.id} />
        ))}
      </div>
    </div>
  );
}
