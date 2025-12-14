import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AddCategory } from '@/components/add-category';
import { categoriesQueryOptions } from '@/query-options/categories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        Administrar Categorías
      </h1>
      <div className="flex w-full gap-8">
        <div className="flex-1">
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Gastos</CardTitle>
              <CardDescription>Categorías para clasificar tus gastos</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryList>
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
                <AddCategory type="income" />
              </CategoryList>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Ingresos</CardTitle>
              <CardDescription>Categorías para clasificar tus Ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryList>
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
                <AddCategory type="expense" />
              </CategoryList>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
