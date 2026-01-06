import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { transactionsQueryOptions } from '../query-options/transactions';
import { TransactionGroup } from '../components/transaction-group';
import { TransactionItem } from '../components/transaction-item';
import { CreateEditTransactionDialog } from '@/modules/transactions/components/add-transaction-dialog';
import { Button } from '@/components/ui/button';
import { TransactionList } from '@/modules/transactions/components/transactions-list';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TransactionsPage() {
  const {
    data: transactions,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(transactionsQueryOptions);

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Transacciones</h1>
          {transactions.length ? (
            <CreateEditTransactionDialog>
              <Button type="button">
                <Plus />
                Nueva Transacción
              </Button>
            </CreateEditTransactionDialog>
          ) : null}
        </div>
        <TransactionList
          dataLength={transactions.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<p className="text-xs text-muted-foreground text-center">Cargando...</p>}
          endMessage={
            <p className="text-xs text-muted-foreground text-center">No hay más transacciones</p>
          }
        >
          {transactions.map((group) => (
            <TransactionGroup key={group.date} date={group.date}>
              {group.transactions?.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </TransactionGroup>
          ))}
        </TransactionList>
      </div>
      <div className="w-[300px]">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle>Cateorias</CardTitle>
            <CardDescription>Aqui van resumen de las categorias</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
