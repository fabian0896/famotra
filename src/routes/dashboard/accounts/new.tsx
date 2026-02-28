import { createFileRoute } from '@tanstack/react-router';
import { NewAccountPage } from '@/modules/accounts/pages/new-account';

export const Route = createFileRoute('/dashboard/accounts/new')({
  component: NewAccountPage,
});
