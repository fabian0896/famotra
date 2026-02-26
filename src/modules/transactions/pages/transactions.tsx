import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { transactionsQueryOptions } from '../query-options/transactions';
import { TransactionList } from '../components/transactions-list';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { DateSelector } from '@/components/date-selector';
import { Spinner } from '@/components/ui/spinner';
import { getDateRange } from '@/lib/date-utils';

const PAGE_SIZE = 20;

export function TransactionsPage() {
  const [range, setRange] = useState(() => getDateRange());
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    transactionsQueryOptions({ pageSize: PAGE_SIZE, filters: { from: range.start, to: range.end } })
  );

  return (
    <Page>
      <Header>
        <Header.Title>Transacciones</Header.Title>
        <Header.Actions>
          <Header.ActionButton>
            <PlusIcon />
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content className="flex flex-col gap-4">
        <DateSelector value={range} onValueChange={setRange} className="mt-4" />

        <div className="space-x-2">
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            All
          </span>
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            Type
          </span>
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            Account
          </span>
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            Category
          </span>
        </div>

        <div className="bg-card rounded-2xl py-3 px-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-green-400 text-center">+$3.000.000</p>
            <p className="text-[11px] text-center font-medium text-muted-foreground">Income</p>
          </div>
          <div className="h-9 w-px bg-muted"></div>
          <div>
            <p className="text-sm font-bold text-red-400 text-center">-$1.000.000</p>
            <p className="text-[11px] text-center font-medium text-muted-foreground">Expenses</p>
          </div>
          <div className="h-9 w-px bg-muted"></div>
          <div>
            <p className="text-sm font-bold text-blue-400 text-center">$1.500.000</p>
            <p className="text-[11px] text-center font-medium text-muted-foreground">Balance</p>
          </div>
        </div>

        <TransactionList
          next={fetchNextPage}
          hasMore={hasNextPage}
          dataLength={data.transactions.length}
          loader={
            <div className="flex justify-center py-3">
              <Spinner className="text-muted-foreground" />
            </div>
          }
          endMessage={
            <p className="text-sm text-muted-foreground text-center py-3">
              No hay más transacciones para este rango de fechas
            </p>
          }
        >
          {data.transactions.map((t) => (
            <TransactionList.Item key={t.id} transaction={t} />
          ))}
        </TransactionList>
      </Content>
    </Page>
  );
}
