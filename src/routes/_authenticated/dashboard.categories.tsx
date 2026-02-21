import { createFileRoute } from '@tanstack/react-router';
import { CategoriesPage } from '@/modules/categories/pages/categories';

export const Route = createFileRoute('/_authenticated/dashboard/categories')({
  component: CategoriesPage,
});
