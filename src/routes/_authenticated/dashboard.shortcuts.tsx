import { createFileRoute } from '@tanstack/react-router';
import { ShortcutsPage } from '@/modules/shortcuts/pages/shortcuts';
import { tokensQueryOptions } from '@/modules/shortcuts/query-options/tokens';

export const Route = createFileRoute('/_authenticated/dashboard/shortcuts')({
  beforeLoad: () => ({ breadcrumb: 'Atajos' }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(tokensQueryOptions);
  },
  component: ShortcutsPage,
});
