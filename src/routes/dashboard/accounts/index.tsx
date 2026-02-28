import { createFileRoute } from '@tanstack/react-router';
import { AccountsPage } from '@/modules/accounts/pages/accounts';

export const Route = createFileRoute('/dashboard/accounts/')({
  component: AccountsPage,
});
