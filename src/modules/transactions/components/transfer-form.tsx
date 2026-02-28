import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { FileTextIcon } from 'lucide-react';
import { sileo } from 'sileo';
import { useRouter } from '@tanstack/react-router';
import { addTransferSchema } from '../models/schemas';
import { Transactions } from '../services/transactions';
import type { Transaction, TransactionsInsert } from '../models/transactions.models';
import { QueryKeys } from '@/constants/query-keys';
import { useAppForm } from '@/hooks/form';
import { formatError } from '@/lib/format-error';
import { Footer } from '@/components/dashboard-layout';
import { InputGroupCard } from '@/components/input-card';

export function TransferForm({
  transaction,
}: {
  transaction?: Transaction;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEdit = Boolean(transaction);

  const create = useMutation({
    mutationFn: Transactions.create,
    onSuccess: () => {
      sileo.success({ title: 'Transaccion creada correctamente!' });
      if (router.history.canGoBack()) {
        router.history.back();
      } else {
        router.navigate({ to: '/dashboard/transactions' });
      }
    },
    onError: (error) => {
      const { message } = formatError(error);
      sileo.error({ title: 'Algo salió mal', description: message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACCOUNTS] });
      form.reset();
    },
  });

  const form = useAppForm({
    defaultValues: {
      id: transaction?.id,
      description: transaction?.description ?? '',
      account_id: transaction?.account_id ?? '',
      destination_account_id: transaction?.destination_account_id ?? '',
      date: transaction?.date ?? formatISO(new Date()),
      amount: Math.abs(transaction?.amount ?? 0),
      transaction_type: 'transfer',
    } satisfies TransactionsInsert,
    validators: {
      onSubmit: addTransferSchema,
    },
    onSubmit: async ({ value }) => {
      await create.mutateAsync(value);
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="py-6">
        <form.AppField
          name="amount"
          children={(field) => <field.TransactionAmountField type="neutral" />}
        />
      </div>
      <div className="flex flex-col gap-3">
        <InputGroupCard>
          <form.AppField
            name="account_id"
            children={(field) => <field.AccountsCardField label="Origen" />}
          />
          <InputGroupCard.Separator />
          <form.AppField
            name="destination_account_id"
            children={(field) => <field.AccountsCardField label="Destino" />}
          />
        </InputGroupCard>
        <form.AppField
          name="description"
          children={(field) => (
            <field.InputCardField
              icon={<FileTextIcon />}
              label="Notas"
              placeholder="Notas de la trasnferencia"
            />
          )}
        />
        <form.AppField name="date" children={(field) => <field.DateField label="Fecha" />} />
      </div>
      <Footer>
        <form.AppForm>
          <form.SubmitButton>{isEdit ? 'Editar' : 'Agregar'} Transferencia</form.SubmitButton>
        </form.AppForm>
      </Footer>
    </form>
  );
}
