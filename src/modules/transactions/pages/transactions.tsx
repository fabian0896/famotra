import { Suspense, useState } from 'react';
import { useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { dailyTotalsOptions, transactionsQueryOptions } from '../query-options/transactions';
import { TransactionList } from '../components/transactions-list';
import { BalanceSummary, BalanceSummarySkeleton } from '../components/balance-summary';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { DateSelector } from '@/components/date-selector';
import { Spinner } from '@/components/ui/spinner';
import { getDateRange } from '@/lib/date-utils';

const PAGE_SIZE = 20;

export function TransactionsPage() {
  const [range, setRange] = useState(() => getDateRange());
  const filters = { from: range.start, to: range.end };
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    transactionsQueryOptions({ pageSize: PAGE_SIZE, filters })
  );
  const { data: dailyTotals, isLoading: dailyTotalsLoading } = useQuery(
    dailyTotalsOptions({ filters })
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

        <Suspense fallback={<BalanceSummarySkeleton />}>
          <BalanceSummary range={range} />
        </Suspense>

        <TransactionList
          dailyTotals={dailyTotals}
          dailyTotalsLoading={dailyTotalsLoading}
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
