import { createFileRoute } from '@tanstack/react-router';
import { SubscriptionsPage } from '@/modules/subscriptions/pages/subscriptions';
import { subscriptionsQueryOptions } from '@/modules/subscriptions/query-options/subscriptions';

export const Route = createFileRoute('/_authenticated/dashboard/subscriptions')({
  beforeLoad: () => ({
    breadcrumb: 'Suscripciones',
  }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureInfiniteQueryData(subscriptionsQueryOptions);
  },
  component: SubscriptionsPage,
});
