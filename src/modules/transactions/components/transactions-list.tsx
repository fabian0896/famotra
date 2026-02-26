import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRightIcon, ReceiptIcon } from 'lucide-react';
import { TransactionDetail } from './transaction-detail';
import { TransactionsSwipeableActions } from './transactions-swipeable-actions';
import type { Transaction, TransactionTypes } from '../models/transactions.models';
import { CategoryIcon } from '@/modules/categories/components/category-icon';
import { AccountDot, AccountName } from '@/modules/accounts/components/account-icon';
import { FormattedMoney, FormattedMoneyTransaction } from '@/components/formatted-money';
import { Swipeable } from '@/components/swipeable';
import { Skeleton } from '@/components/ui/skeleton';

function CategoryBadge({
  category,
  trasactionType,
}: {
  category?: Transaction['category'];
  trasactionType?: TransactionTypes;
}) {
  if (trasactionType === 'transfer') {
    return (
      <span className="text-[10px] font-semibold text-blue-400 bg-blue-600/15 leading-[13px] py-[3px] px-2 rounded-[6px]">
        Transferencia
      </span>
    );
  }

  if (!category) {
    return (
      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/15 leading-[13px] py-[3px] px-2 rounded-[6px]">
        Sin categoría
      </span>
    );
  }

  return (
    <span
      style={{ '--color': category.color } as React.CSSProperties}
      className="text-[10px] font-semibold text-(--color) bg-(--color)/15 leading-[13px] py-[3px] px-2 rounded-[6px]"
    >
      {category.name}
    </span>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <Swipeable as="li">
      <TransactionDetail transaction={transaction}>
        <Swipeable.Item>
          <button className="w-full bg-card text-left p-4 flex gap-3 items-center transition-colors active:bg-muted">
            <CategoryIcon
              className="size-11 rounded-xl shrink-0"
              transactionType={transaction.transaction_type}
              category={transaction.category}
            />
            <div className="flex-1">
              <div className="mb-1 flex gap-3">
                <p className="flex-1 text-base font-semibold text-foreground line-clamp-1">
                  {transaction.description}
                </p>
                <p className="font-bold text-sm">
                  <FormattedMoneyTransaction transactionType={transaction.transaction_type}>
                    {transaction.amount}
                  </FormattedMoneyTransaction>
                </p>
              </div>
              <div className="flex gap-3">
                {transaction.transaction_type === 'transfer' ? (
                  <div className="flex-1 flex gap-1.5 items-center justify-start">
                    <div className="flex items-center gap-1.5">
                      <AccountDot account={transaction.account} className="size-2 rounded-full" />
                      <AccountName
                        part="account"
                        className="text-xs font-medium text-muted-foreground leading-[19px] line-clamp-1"
                        as="p"
                        account={transaction.account}
                      />
                    </div>
                    <ArrowRightIcon className="size-2.5 text-muted-foreground" />
                    <div className="flex items-center gap-1.5">
                      <AccountDot
                        account={transaction.destination}
                        className="size-2 rounded-full"
                      />
                      <AccountName
                        part="account"
                        className="text-xs font-medium text-muted-foreground leading-[19px] line-clamp-1"
                        as="p"
                        account={transaction.destination}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-1.5">
                    <AccountDot account={transaction.account} className="size-2 rounded-full" />
                    <AccountName
                      className="text-xs font-medium text-muted-foreground leading-[19px] line-clamp-1"
                      as="p"
                      account={transaction.account}
                    />
                  </div>
                )}
                <CategoryBadge
                  trasactionType={transaction.transaction_type}
                  category={transaction.category}
                />
              </div>
            </div>
          </button>
        </Swipeable.Item>
      </TransactionDetail>
      <TransactionsSwipeableActions className="rounded-r-none" transaction={transaction} />
    </Swipeable>
  );
}

function TransactionGoup({
  date,
  children,
  totals,
  totalsLoading,
}: {
  date: string;
  totals?: Map<string, number>;
  totalsLoading: boolean;
  children?: React.ReactElement<React.ComponentProps<typeof TransactionItem>>[];
}) {
  const total = totals?.get(date);

  const parsedDate = parseISO(`${date}T12:00:00`);
  const defaultFormat = format(parsedDate, 'MMMM d', { locale: es });
  const formatDate = isToday(parsedDate)
    ? `Hoy, ${defaultFormat}`
    : isYesterday(parsedDate)
      ? `Ayer, ${defaultFormat}`
      : defaultFormat;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-semibold text-foreground first-letter:uppercase">{formatDate}</p>
        {totalsLoading ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          total !== undefined && (
            <p className="text-sm font-semibold text-muted-foreground">
              <FormattedMoney value={total} />
            </p>
          )
        )}
      </div>
      <ul className="block space-y-1 bg-card rounded-[20px] overflow-hidden">{children}</ul>
    </div>
  );
}

function EmptyList() {
  return (
    <div className="py-10 px-6 flex flex-col gap-4">
      <div className="size-20 bg-card rounded-full mx-auto grid place-items-center">
        <ReceiptIcon className="size-9 text-muted-foreground/90" />
      </div>
      <h2 className="text-base font-semibold text-center text-foreground leading-5">
        No transactions yet
      </h2>
      <p className="text-sm font-medium text-muted-foreground text-center">
        Your transactions for this month will appear here
      </p>
    </div>
  );
}

function TransactionListRoot({
  children,
  dailyTotals,
  dailyTotalsLoading = false,
  ...props
}: React.ComponentProps<typeof InfiniteScroll> & {
  dailyTotals?: Map<string, number>;
  dailyTotalsLoading?: boolean;
  children?: React.ReactElement<React.ComponentProps<typeof TransactionItem>>[];
}) {
  const list = React.Children.toArray(children) as React.ReactElement<
    React.ComponentProps<typeof TransactionItem>
  >[];

  if (!list.length) return <EmptyList />;

  const groups = Object.groupBy(list, (item) => item.props.transaction.date);

  return (
    <InfiniteScroll {...props} className="space-y-4">
      {Object.entries(groups).map(([date, transactions]) => (
        <TransactionGoup
          date={date}
          key={date}
          totals={dailyTotals}
          totalsLoading={dailyTotalsLoading}
        >
          {transactions}
        </TransactionGoup>
      ))}
    </InfiniteScroll>
  );
}

export const TransactionList = Object.assign(TransactionListRoot, {
  Item: TransactionItem,
});
