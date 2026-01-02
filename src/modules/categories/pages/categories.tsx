import { useSuspenseQuery } from '@tanstack/react-query';
import { categoriesQueryOptions } from '../query-options/categories';
import { CategoryItem } from '../components/category-item';
import { CreateEditCategoryDialog } from '../components/create-edit-category';
import { CategoryList } from '../components/category-list';
import { AddCategotyButton } from '../components/add-category-button';

export function CategoriesPage() {
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
