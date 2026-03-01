import { useRouter, useSearch } from '@tanstack/react-router';
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
  const router = useRouter();
  const { type = 'expense' } = useSearch({ from: '/dashboard/transactions/new' });

  const onSuccess = () => {
    if (router.history.canGoBack()) {
      return router.history.back();
    }
    return router.navigate({ to: '/dashboard/transactions' });
  };

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
            router.navigate({
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
            <TransactionForm type="expense" onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="income">
            <TransactionForm type="income" onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="transfer">
            <TransferForm onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </Content>
    </Page>
  );
}
