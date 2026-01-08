import { createFileRoute } from '@tanstack/react-router';
import { categoriesQueryOptions } from '@/modules/categories/query-options/categories';
import { CategoriesPage } from '@/modules/categories/pages/categories';

export const Route = createFileRoute('/_authenticated/dashboard/categories')({
  beforeLoad: () => ({ breadcrumb: 'Categorias' }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(categoriesQueryOptions);
  },
  component: CategoriesPage,
});
