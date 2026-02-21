import { createFileRoute } from '@tanstack/react-router';
import { CategoryDetails } from '@/modules/categories/pages/category-details';

export const Route = createFileRoute('/dashboard/categories/$id')({
  component: Index,
});

export function Index() {
  const { id } = Route.useParams();
  return <CategoryDetails id={id} />;
}
