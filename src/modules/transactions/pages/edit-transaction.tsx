import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { Trash2Icon } from 'lucide-react';
import { transactionByIdOptions } from '../query-options/transactions';
import { TransactionForm } from '../components/transaction-form';
import { TransferForm } from '../components/transfer-form';
import { DeleteTransactionDialog } from '../components/delete-transacion-dialog';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function EditTransactionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams({ from: '/dashboard/transactions/$id/edit' });
  const { data: transaction } = useSuspenseQuery(transactionByIdOptions(id, queryClient));

  const onSuccess = () => {
    if (router.history.canGoBack()) {
      return router.history.back();
    }
    return router.navigate({ to: '/dashboard/transactions' });
  };

  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Editar Transacción</Header.Title>
        <Header.Actions>
          <DeleteTransactionDialog onRemoved={onSuccess} transactionId={transaction.id}>
            <Header.ActionButton size="sm" variant="destructive">
              <Trash2Icon />
            </Header.ActionButton>
          </DeleteTransactionDialog>
        </Header.Actions>
      </Header>

      <Content className="pt-5">
        {transaction.transaction_type === 'transfer' ? (
          <TransferForm onSuccess={onSuccess} transaction={transaction} />
        ) : (
          <TransactionForm
            onSuccess={onSuccess}
            type={transaction.transaction_type}
            transaction={transaction}
          />
        )}
      </Content>
    </Page>
  );
}
