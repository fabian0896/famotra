import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { transactionsQueryOptions } from '../query-options/transactions';
import { CreateEditTransactionDialog } from '@/modules/transactions/components/add-transaction-dialog';
import { Button } from '@/components/ui/button';
import {
  EmpltyTransactionList,
  TransactionList,
} from '@/modules/transactions/components/transactions-list';

export function TransactionsPage() {
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    transactionsQueryOptions({ pageSize: 20 })
  );

  return (
    <div className="flex gap-6 max-w-2xl mx-auto">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Transacciones
          </h1>
          {data.transactions.length ? (
            <CreateEditTransactionDialog>
              <Button type="button">
                <Plus />
                Nueva Transacción
              </Button>
            </CreateEditTransactionDialog>
          ) : null}
        </div>
        <TransactionList
          empty={<EmpltyTransactionList />}
          dataLength={data.transactions.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<p className="text-xs text-muted-foreground text-center">Cargando...</p>}
          endMessage={
            <p className="text-xs text-muted-foreground text-center">No hay más transacciones</p>
          }
        >
          <div></div>
          {/* {transactions.map((group) => (
            <TransactionGroup key={group.date} date={group.date}>
              {group.transactions?.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </TransactionGroup>
          ))} */}
        </TransactionList>
      </div>
      {/* <div className="w-[300px] xl:w-[350px]">
        <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
          <CategoryResume />
        </Suspense>
      </div> */}
    </div>
  );
}
