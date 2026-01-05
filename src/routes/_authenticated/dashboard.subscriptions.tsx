import { createFileRoute } from '@tanstack/react-router';
import { SubscriptionsPage } from '@/modules/subscriptions/pages/subscriptions';

export const Route = createFileRoute('/_authenticated/dashboard/subscriptions')({
  beforeLoad: () => ({
    breadcrumb: 'Suscripciones',
  }),
  component: SubscriptionsPage,
});
