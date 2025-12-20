import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AddCategotyButton, CreateEditCategoryDialog } from '@/components/create-edit-category';
import { categoriesQueryOptions } from '@/query-options/categories';
import { CategoryItem, CategoryList } from '@/components/category-item';

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
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions);

  return (
    <div className="container mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        Categorías
      </h1>
      <div className="flex flex-col gap-10 mt-8">
        <CategoryList
          title="Categorías de Ingresos"
          description="Gestiona tus categorías de ingresos aquí."
        >
          {categories.income.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
          <CreateEditCategoryDialog type="income">
            <AddCategotyButton />
          </CreateEditCategoryDialog>
        </CategoryList>

        <CategoryList
          title="Categorías de Gastos"
          description="Gestiona tus categorías de gastos aquí."
        >
          {categories.expense.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
          <CreateEditCategoryDialog type="expense">
            <AddCategotyButton />
          </CreateEditCategoryDialog>
        </CategoryList>
      </div>
    </div>
  );
}
