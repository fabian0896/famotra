import { createFileRoute } from '@tanstack/react-router';
import { BanksPage } from '@/modules/admin/pages/banks';
import { banksQueryOptions } from '@/query-options/banks';

export const Route = createFileRoute('/dashboard/admin/banks')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(banksQueryOptions);
  },
  component: BanksPage,
});
