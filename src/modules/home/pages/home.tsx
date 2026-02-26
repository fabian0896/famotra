import { Suspense } from 'react';
import { ArrowRightLeftIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { ResumeCard, ResumeCardSkeleton } from '../components/resume-card';
import { QuickActionButton, QuickActions } from '../components/quick-actions';
import { RecentTransactions, RecentTransactionsSkeleton } from '../components/recent-transactions';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { getDateRange } from '@/lib/date-utils';
import { balanceSummaryOptions, transactionsQueryOptions } from '@/modules/transactions/query-options/transactions';

const PAGE_SIZE = 10;

export function HomePage() {
  const queryClient = useQueryClient();
  const range = getDateRange();

  const handleRefres = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: balanceSummaryOptions(range).queryKey }),
      queryClient.invalidateQueries({
        queryKey: transactionsQueryOptions({ pageSize: PAGE_SIZE }).queryKey,
      }),
    ]);
  };

  return (
    <Page onRefresh={handleRefres}>
      <Header>
        <Header.Title>Famotra</Header.Title>
      </Header>

      <Content className="space-y-5">
        <Suspense fallback={<ResumeCardSkeleton />}>
          <ResumeCard range={range} />
        </Suspense>

        <QuickActions>
          <QuickActionButton label="Ingreso" variant="income">
            <PlusIcon />
          </QuickActionButton>
          <QuickActionButton label="Gasto" variant="expense">
            <MinusIcon />
          </QuickActionButton>
          <QuickActionButton label="Transferencia" variant="transfer">
            <ArrowRightLeftIcon />
          </QuickActionButton>
        </QuickActions>

        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactions pageSize={PAGE_SIZE} />
        </Suspense>
      </Content>
    </Page>
  );
}
