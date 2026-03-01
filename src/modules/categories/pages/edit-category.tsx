import { useSuspenseQuery } from '@tanstack/react-query';
import { CategoryForm } from '../components/category-form';
import { categoryByIdOption } from '../query-options/categories';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function EditCategory({ categoryId }: { categoryId: string }) {
  const { data: category } = useSuspenseQuery(categoryByIdOption({ id: categoryId }));
  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Editar categoría</Header.Title>
      </Header>

      <Content>
        <CategoryForm category={category} />
      </Content>
    </Page>
  );
}
