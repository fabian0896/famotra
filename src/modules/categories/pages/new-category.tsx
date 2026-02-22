import { CategoryForm } from '../components/category-form';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function NewCategory() {
  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Nueva categoría</Header.Title>
      </Header>

      <Content>
        <CategoryForm />
      </Content>
    </Page>
  );
}
