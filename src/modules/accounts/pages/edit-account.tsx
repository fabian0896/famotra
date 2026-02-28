import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { Trash2Icon } from 'lucide-react';
import { accountByIdOptions } from '../query-options/accounts';
import { AccountForm } from '../components/account-form';
import { DeleteAccountDialog } from '../components/delete-account-dialog';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function EditAccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams({ from: '/dashboard/accounts/$id/edit' });
  const { data: account } = useSuspenseQuery(accountByIdOptions(id, queryClient));

  const handleSuccess = () => {
    if (router.history.canGoBack()) {
      return router.history.back();
    }
    return router.navigate({ to: '/dashboard/accounts' });
  };

  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Editar cuenta</Header.Title>
        <Header.Actions>
          <DeleteAccountDialog
            onRemoved={handleSuccess}
            accountId={account.id}
            accountName={account.name}
          >
            <Header.ActionButton size="sm" variant="destructive">
              <Trash2Icon />
            </Header.ActionButton>
          </DeleteAccountDialog>
        </Header.Actions>
      </Header>

      <Content>
        <AccountForm account={account} onSuccess={handleSuccess} />
      </Content>
    </Page>
  );
}
