import { Suspense, useState } from 'react';
import { useQuery, useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { dailyTotalsOptions, transactionsQueryOptions } from '../query-options/transactions';
import { TransactionList, TransactionListSkeleton } from '../components/transactions-list';
import { BalanceSummary, BalanceSummarySkeleton } from '../components/balance-summary';
import { AccountFilter, CategoryFilter, FiltersBar, TypeFilter } from '../components/filters';
import type { TransactionFilters } from '../models/transaction-filters';
import type { TransactionTypes } from '../models/transactions.models';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { DateSelector } from '@/components/date-selector';
import { Spinner } from '@/components/ui/spinner';
import { getDateRange } from '@/lib/date-utils';
import { QueryKeys } from '@/constants/query-keys';

const PAGE_SIZE = 20;

function TransactionListData({ filters }: { filters: TransactionFilters }) {
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    transactionsQueryOptions({ pageSize: PAGE_SIZE, filters })
  );
  const { data: dailyTotals, isLoading: dailyTotalsLoading } = useQuery(
    dailyTotalsOptions({ filters })
  );

  return (
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
  );
}

export function TransactionsPage() {
  const queryClient = useQueryClient();
  const [range, setRange] = useState(() => getDateRange());
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [transactionType, setTransactionType] = useState<TransactionTypes | undefined>();
  const filters = {
    from: range.start,
    to: range.end,
    accountIds: accountIds.length ? accountIds : undefined,
    categoryIds: categoryIds.length ? categoryIds : undefined,
    transactionType,
  };

  const hasActiveFilters =
    accountIds.length > 0 || categoryIds.length > 0 || transactionType !== undefined;

  const clearAllFilters = () => {
    setAccountIds([]);
    setCategoryIds([]);
    setTransactionType(undefined);
  };

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
  };

  return (
    <Page onRefresh={refresh}>
      <Header>
        <Header.Title>Transacciones</Header.Title>
        <Header.Actions>
          <Header.ActionButton asChild>
            <Link to="/dashboard/transactions/new">
              <PlusIcon />
            </Link>
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content className="flex flex-col gap-4">
        <DateSelector value={range} onValueChange={setRange} className="mt-4" />

        <FiltersBar isAllActive={!hasActiveFilters} onClearAll={clearAllFilters}>
          <TypeFilter value={transactionType} onChange={setTransactionType} />
          <AccountFilter value={accountIds} onChange={setAccountIds} />
          <CategoryFilter value={categoryIds} onChange={setCategoryIds} />
        </FiltersBar>

        <Suspense fallback={<BalanceSummarySkeleton />}>
          <BalanceSummary range={range} />
        </Suspense>

        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionListData filters={filters} />
        </Suspense>
      </Content>
    </Page>
  );
}
