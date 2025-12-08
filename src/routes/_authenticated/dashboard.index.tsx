import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  beforeLoad: () => ({
    breadcrumb: 'Inicio',
  }),
  component: Index,
});

function Index() {
  return <div>Home Page</div>;
}
