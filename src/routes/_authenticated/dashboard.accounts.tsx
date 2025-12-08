import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/accounts')({
  beforeLoad: () => ({
    breadcrumb: 'Cuentas',
  }),
  component: Accounts,
});

function Accounts() {
  return <div>Accounts</div>;
}
