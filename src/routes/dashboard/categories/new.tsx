import { createFileRoute } from '@tanstack/react-router';
import { CreateEditCategory } from '@/modules/categories/pages/create-edit-category';

export const Route = createFileRoute('/dashboard/categories/new')({
  component: CreateEditCategory,
});
