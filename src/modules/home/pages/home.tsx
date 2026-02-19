import { Suspense } from 'react';
import { ArrowRightLeftIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { ResumeCard, ResumeCardSkeleton } from '../components/resume-card';
import { QuickActionButton, QuickActions } from '../components/quick-actions';
import { RecentTransactions, RecentTransactionsSkeleton } from '../components/recent-transactions';
import { Content, Header } from '@/components/dashboard-layout';

export function HomePage() {
  return (
    <>
      <Header title="Famotra" />

      <Content className="space-y-5">
        <Suspense fallback={<ResumeCardSkeleton />}>
          <ResumeCard />
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
          <RecentTransactions />
        </Suspense>
      </Content>
    </>
  );
}
