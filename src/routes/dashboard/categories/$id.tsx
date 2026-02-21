import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { CategoryDetails } from '@/modules/categories/pages/category-details';

export const Route = createFileRoute('/dashboard/categories/$id')({
  validateSearch: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }),
  component: Index,
});

export function Index() {
  const { id } = Route.useParams();
  return <CategoryDetails id={id} />;
}
