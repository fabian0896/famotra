import { Content, Header } from '@/components/dashboard-layout';

export function CreateEditCategory() {
  return (
    <>
      <Header>
        <Header.BackButton />
        <Header.Title>Nueva categoría</Header.Title>
      </Header>

      <Content>
        <p>Hola mundo!</p>
      </Content>
    </>
  );
}
