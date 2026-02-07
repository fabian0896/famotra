import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ShortcutsPage } from '@/modules/shortcuts/pages/shortcuts';
import { tokensQueryOptions } from '@/modules/shortcuts/query-options/tokens';
import { shortcutsCardsQueryOptions } from '@/modules/shortcuts/query-options/shortcuts-cards';
import { shortcutsMerchantsQueryOptions } from '@/modules/shortcuts/query-options/shortcuts-merchants';

const searchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute('/_authenticated/dashboard/shortcuts')({
  validateSearch: searchSchema,
  beforeLoad: () => ({ breadcrumb: 'Atajos' }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await Promise.all([
      queryClient.ensureQueryData(tokensQueryOptions),
      queryClient.ensureQueryData(shortcutsCardsQueryOptions),
      queryClient.ensureQueryData(shortcutsMerchantsQueryOptions),
    ]);
  },
  component: Page,
});

function Page() {
  const { tab } = Route.useSearch();
  return <ShortcutsPage tab={tab} />;
}
