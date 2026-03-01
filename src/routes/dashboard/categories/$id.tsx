import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { CategoryDetails } from '@/modules/categories/pages/category-details';
import { categoryByIdOption } from '@/modules/categories/query-options/categories';

export const Route = createFileRoute('/dashboard/categories/$id')({
  validateSearch: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }),
  beforeLoad: async ({ context, params }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(categoryByIdOption({ id: params.id }));
  },
  component: Index,
});

export function Index() {
  const { id } = Route.useParams();
  return <CategoryDetails id={id} />;
}
