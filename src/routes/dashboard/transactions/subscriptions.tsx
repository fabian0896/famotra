import { createFileRoute } from '@tanstack/react-router';
import { SubscriptionsPage } from '@/modules/transactions/pages/subscriptions';

export const Route = createFileRoute('/dashboard/transactions/subscriptions')({
  component: SubscriptionsPage,
});
