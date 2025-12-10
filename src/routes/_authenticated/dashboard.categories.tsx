import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AddCategory } from '@/components/add-category';
import { categoriesQueryOptions } from '@/query-options/categories';

export const Route = createFileRoute('/_authenticated/dashboard/categories')({
  beforeLoad: () => ({
    breadcrumb: 'Categorias',
  }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(categoriesQueryOptions);
  },
  component: Categories,
});

function Categories() {
  const [parent] = useAutoAnimate();
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions);

  return (
    <div className="container mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        Administrar Categorías
      </h1>
      <section className="mt-8">
        <h2 className="scroll-m-20 border-b pb-2 mb-6 text-3xl font-semibold tracking-tight first:mt-0">
          Gastos
        </h2>
        <ul ref={parent} className="flex gap-8">
          {categories.map((category) => (
            <li className="flex flex-col gap-1.5" key={category.id}>
              <div className="bg-primary-foreground rounded-full w-16 h-16 text-3xl flex items-center justify-center">
                <span>{category.icon}</span>
              </div>
              <span className="text-muted-foreground text-center font-medium text-sm lowercase first-letter:capitalize">
                {category.name}
              </span>
            </li>
          ))}
          <AddCategory type="income" />
        </ul>
      </section>
    </div>
  );
}
