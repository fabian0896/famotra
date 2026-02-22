import { createFileRoute } from '@tanstack/react-router';
import { NewCategory } from '@/modules/categories/pages/new-category';

export const Route = createFileRoute('/dashboard/categories/new')({
  component: NewCategory,
});
