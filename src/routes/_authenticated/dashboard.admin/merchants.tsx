import { createFileRoute } from '@tanstack/react-router';
import { MerchantsPage } from '@/modules/admin/pages/merchants';

export const Route = createFileRoute('/_authenticated/dashboard/admin/merchants')({
  component: MerchantsPage,
});
