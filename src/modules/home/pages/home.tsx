import { Suspense } from 'react';
import { ArrowRightLeftIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { ResumeCard, ResumeCardSkeleton } from '../components/resume-card';
import { QuickActionButton, QuickActions } from '../components/quick-actions';
import { RecentTransactions, RecentTransactionsSkeleton } from '../components/recent-transactions';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function HomePage() {
  return (
    <Page>
      <Header>
        <Header.Title>Famotra</Header.Title>
      </Header>

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
    </Page>
  );
}
