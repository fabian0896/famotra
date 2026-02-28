import { Suspense } from 'react';
import { PlusIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { AccountList, AccountListSkeleton } from '../components/account-list';
import { NetWorthSummary, NetWorthSummarySkeleton } from '../components/net-worth-summary';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { QueryKeys } from '@/constants/query-keys';

export function AccountsPage() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: [QueryKeys.ACCOUNTS] });
  };

  return (
    <Page onRefresh={refresh}>
      <Header>
        <Header.Title>Cuentas</Header.Title>
        <Header.Actions>
          <Header.ActionButton asChild>
            <Link to="/dashboard/accounts/new">
              <PlusIcon />
            </Link>
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content className="flex flex-col gap-5">
        <Suspense fallback={<NetWorthSummarySkeleton className="py-5" />}>
          <NetWorthSummary className="py-5" />
        </Suspense>
        <Suspense fallback={<AccountListSkeleton />}>
          <AccountList />
        </Suspense>
      </Content>
    </Page>
  );
}
