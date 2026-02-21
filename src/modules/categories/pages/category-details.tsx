import { Content, Header } from '@/components/dashboard-layout';

export function CategoryDetails({ id }: { id: string }) {
  return (
    <>
      <Header />

      <Content>
        <p>Hola desde {id}</p>
      </Content>
    </>
  );
}
