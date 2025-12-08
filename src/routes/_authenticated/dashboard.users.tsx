import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/users')({
  beforeLoad: () => ({
    breadcrumb: 'Usuarios',
  }),
  component: Users,
});

function Users() {
  return <div>User Page</div>;
}
