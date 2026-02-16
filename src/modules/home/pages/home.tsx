import { ArrowRightLeftIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { ResumeCard } from '../components/resume-card';
import { QuickActionButton, QuickActions } from '../components/quick-actions';
import { RecentTransactions } from '../components/recent-transactions';
import { Content, Header } from '@/components/dashboard-layout';

export function HomePage() {
  return (
    <>
      <Header title="Famotra" />

      <Content className="space-y-5">
        <ResumeCard />

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

        <RecentTransactions />
      </Content>
    </>
  );
}
