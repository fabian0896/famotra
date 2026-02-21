import { createFileRoute } from '@tanstack/react-router';
import { MerchantsPage } from '@/modules/admin/pages/merchants';

export const Route = createFileRoute('/dashboard/admin/merchants')({
  component: MerchantsPage,
});
