import { useNavigate, useSearch } from '@tanstack/react-router';
import { TransactionForm } from '../components/transaction-form';
import { TransferForm } from '../components/transfer-form';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NAME = {
  expense: 'Gasto',
  income: 'Ingreso',
  transfer: 'Transferencia',
} as const;

export function NewTransactionPage() {
  const navigate = useNavigate();
  const { type = 'expense' } = useSearch({ from: '/dashboard/transactions/new' });

  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Agregar {NAME[type]}</Header.Title>
      </Header>

      <Content className="pt-5">
        <Tabs
          value={type}
          onValueChange={(tab) =>
            navigate({
              to: '.',
              search: { type: tab as 'expense' | 'income' | 'transfer' },
              replace: true,
            })
          }
          className="gap-6"
        >
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
          <TabsContent value="transfer">
            <TransferForm />
          </TabsContent>
        </Tabs>
      </Content>
    </Page>
  );
}
