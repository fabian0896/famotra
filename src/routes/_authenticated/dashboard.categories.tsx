import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/categories')({
  beforeLoad: () => ({
    breadcrumb: 'Categorias',
  }),
  component: Categories,
});

function Categories() {
  return <div>Categories</div>;
}
