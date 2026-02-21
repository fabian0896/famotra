import { createFileRoute } from '@tanstack/react-router';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { AccountsPage } from '@/modules/accounts/pages/accounts';

export const Route = createFileRoute('/dashboard/accounts')({
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(accountsQueryOptions);
  },
  component: AccountsPage,
});
