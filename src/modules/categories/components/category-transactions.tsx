import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PlusIcon, ReceiptIcon } from 'lucide-react';
import { categoryByIdOption } from '../query-options/categories';
import type { DateRange } from '@/hooks/use-date-range';
import type { Transaction } from '@/modules/transactions/models/transactions.models';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { transactionsQueryOptions } from '@/modules/transactions/query-options/transactions';
import { LocalDateFormat } from '@/components/local-date-format';
import { AccountIcon, AccountName } from '@/modules/accounts/components/account-icon';
import { TransactionDetail } from '@/modules/transactions/components/transaction-detail';
import { Button } from '@/components/ui/button';
import { getContrastColor } from '@/lib/get-contrast-color';

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <li className="block">
      <TransactionDetail transaction={transaction}>
        <button className="p-3.5 py-3 bg-card rounded-xl flex items-center gap-3 w-full text-left transition-all active:bg-muted">
          <AccountIcon className="size-10 rounded-xl" account={transaction.account} />
          <div className="flex-1 flex flex-col">
            <p className="text-sm font-semibold text-foreground mb-0.5 line-clamp-1">
              {transaction.description}
            </p>
            <AccountName
              as="p"
              account={transaction.account}
              className="text-xs font-medium text-muted-foreground text-left line-clamp-1"
            />
          </div>
          <div className="flex flex-col">
            <FormattedMoneyTransaction
              className="text-sm font-bold mb-0.5 text-right"
              value={transaction.amount}
            />
            <LocalDateFormat
              as="p"
              formatStr="MMM d, yyy"
              className="text-xs font-medium text-muted-foreground text-right first-letter:uppercase"
            >
              {transaction.date}
            </LocalDateFormat>
          </div>
        </button>
      </TransactionDetail>
    </li>
  );
}

export function EmptyList({ categoryId }: { categoryId: string }) {
  const { data: category } = useSuspenseQuery(categoryByIdOption({ id: categoryId }));
  return (
    <div className="py-10 px-6 flex flex-col gap-4">
      <div className="size-20 bg-card rounded-full mx-auto grid place-items-center">
        <ReceiptIcon className="size-9 text-muted-foreground/90" />
      </div>
      <h2 className="text-base font-semibold text-center text-foreground leading-5">
        Sin movimientos
      </h2>
      <p className="text-sm font-medium text-muted-foreground text-center">
        Los movimientos de esta categoría aparecerán aquí
      </p>
      <Button
        style={
          {
            '--color': category.color,
            '--text-color': getContrastColor(category.color),
          } as React.CSSProperties
        }
        className="h-[38px] rounded-[12px] bg-(--color) text-(--text-color) shadow-none w-fit mx-auto"
      >
        <PlusIcon />
        Agregar movimiento
      </Button>
    </div>
  );
}

export function CategoryTransactions({
  categoryId,
  range,
  className,
  ...props
}: { categoryId: string; range: DateRange } & React.ComponentProps<'div'>) {
  const [parent] = useAutoAnimate();
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(
    transactionsQueryOptions({
      pageSize: 25,
      filters: { categoryId, from: range.start, to: range.end },
    })
  );
  return (
    <div className={className} {...props}>
      <div className="flex justify-between items-center">
        <p className="text-base font-semibold text-foreground">Transacciones</p>
        <p className="text-sm font-medium text-muted-foreground">
          {data.count} {data.count === 1 ? 'Movimiento' : 'Movimientos'}
        </p>
      </div>
      {data.count === 0 ? (
        <EmptyList categoryId={categoryId} />
      ) : (
        <InfiniteScroll
          hasMore={hasNextPage}
          next={fetchNextPage}
          dataLength={data.transactions.length}
          className="scrollbar-hide"
          loader={<p className="text-sm text-muted-foreground text-center mt-6">Cargando...</p>}
          endMessage={
            <p className="text-xs text-muted-foreground text-center mt-6">
              No hay más movimientos para este rango de fechas
            </p>
          }
        >
          <ul ref={parent} className="mt-3 space-y-1">
            {data.transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </div>
  );
}
