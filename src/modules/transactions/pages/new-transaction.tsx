import { TransactionForm } from '../components/transaction-form';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function NewTransactionPage() {
  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Agregar Transacción</Header.Title>
      </Header>

      <Content className="pt-5">
        <Tabs className="gap-6">
          <TabsList>
            <TabsTrigger value="expense">Gasto</TabsTrigger>
            <TabsTrigger value="income">Ingreso</TabsTrigger>
            <TabsTrigger value="transfer">Transferencia</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <TransactionForm type="expense" />
          </TabsContent>
          <TabsContent value="income">
            <TransactionForm type="income" />
          </TabsContent>
          <TabsContent value="transfer">Forma de trasnferencias</TabsContent>
        </Tabs>
      </Content>
    </Page>
  );
}
