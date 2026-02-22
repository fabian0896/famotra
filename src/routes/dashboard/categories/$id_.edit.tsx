import { createFileRoute } from '@tanstack/react-router';
import { EditCategory } from '@/modules/categories/pages/edit-category';
import { categoryByIdOption } from '@/modules/categories/query-options/categories';

export const Route = createFileRoute('/dashboard/categories/$id_/edit')({
  beforeLoad: async ({ context, params }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(categoryByIdOption({ id: params.id, queryClient }));
  },
  component: Index,
});

export function Index() {
  const { id } = Route.useParams();
  return <EditCategory categoryId={id} />;
}
