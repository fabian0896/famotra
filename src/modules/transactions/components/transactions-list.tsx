import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { TransactionDetail } from './transaction-detail';
import { TransactionsSwipeableActions } from './transactions-swipeable-actions';
import type { Transaction, TransactionTypes } from '../models/transactions.models';
import { CategoryIcon } from '@/modules/categories/components/category-icon';
import { AccountName } from '@/modules/accounts/components/account-icon';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { Swipeable } from '@/components/swipeable';

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
              className="size-11 rounded-xl"
              transactionType={transaction.transaction_type}
              category={transaction.category}
            />
            <div className="flex-1">
              <p className="text-base font-semibold text-foreground line-clamp-1 mb-1">
                {transaction.description}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-primary"></div>
                <AccountName
                  className="text-xs font-medium text-muted-foreground leading-[19px] line-clamp-1"
                  as="p"
                  account={transaction.account}
                />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-bold text-sm mb-1">
                <FormattedMoneyTransaction transactionType={transaction.transaction_type}>
                  {transaction.amount}
                </FormattedMoneyTransaction>
              </p>
              <CategoryBadge
                trasactionType={transaction.transaction_type}
                category={transaction.category}
              />
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
}: {
  date: string;
  children?: React.ReactElement<React.ComponentProps<typeof TransactionItem>>[];
}) {
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
        <p className="text-sm font-semibold text-muted-foreground">$500.000</p>
      </div>
      <ul className="block space-y-1 bg-card rounded-[20px] overflow-hidden">{children}</ul>
    </div>
  );
}

function TransactionListRoot({
  children,
  ...props
}: React.ComponentProps<typeof InfiniteScroll> & {
  children?: React.ReactElement<React.ComponentProps<typeof TransactionItem>>[];
}) {
  const list = React.Children.toArray(children) as React.ReactElement<
    React.ComponentProps<typeof TransactionItem>
  >[];

  if (!list.length) return <p>No hay tranacciones</p>;

  const groups = Object.groupBy(list, (item) => item.props.transaction.date);

  return (
    <InfiniteScroll {...props} className="space-y-4">
      {Object.entries(groups).map(([date, transactions]) => (
        <TransactionGoup date={date} key={date}>
          {transactions}
        </TransactionGoup>
      ))}
    </InfiniteScroll>
  );
}

export const TransactionList = Object.assign(TransactionListRoot, {
  Item: TransactionItem,
});
