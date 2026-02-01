import { createFileRoute } from '@tanstack/react-router';
import { ShortcutsPage } from '@/modules/shortcuts/pages/shortcuts';
import { tokensQueryOptions } from '@/modules/shortcuts/query-options/tokens';
import { shortcutsCardsQueryOptions } from '@/modules/shortcuts/query-options/shortcuts-cards';
import { shortcutsMerchantsQueryOptions } from '@/modules/shortcuts/query-options/shortcuts-merchants';

export const Route = createFileRoute('/_authenticated/dashboard/shortcuts')({
  beforeLoad: () => ({ breadcrumb: 'Atajos' }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await Promise.all([
      queryClient.ensureQueryData(tokensQueryOptions),
      queryClient.ensureQueryData(shortcutsCardsQueryOptions),
      queryClient.ensureQueryData(shortcutsMerchantsQueryOptions),
    ]);
  },
  component: ShortcutsPage,
});
