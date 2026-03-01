import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { FileTextIcon } from 'lucide-react';
import { sileo } from 'sileo';
import { Transactions } from '../services/transactions';
import { addTransactionsSchema } from '../models/schemas';
import type { Transaction, TransactionsInsert } from '../models/transactions.models';
import type { CategoryTypes } from '@/modules/categories/models/categories.models';
import { QueryKeys } from '@/constants/query-keys';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { formatError } from '@/lib/format-error';
import { useAppForm } from '@/hooks/form';
import { Footer } from '@/components/dashboard-layout';

export function TransactionForm({
  type,
  transaction,
  onSuccess,
}: {
  type: CategoryTypes;
  transaction?: Transaction;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const { data } = useQuery(accountsQueryOptions());
  const accounts = data?.accounts || [];

  const isEdit = Boolean(transaction);

  const create = useMutation({
    mutationFn: Transactions.upsert,
    onSuccess: () => {
      sileo.success({ title: 'Transaccion creada correctamente!' });
      onSuccess?.();
    },
    onError: (error) => {
      const { message } = formatError(error);
      sileo.error({ title: 'Algo salió mal', description: message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: accountsQueryOptions().queryKey });
    },
  });

  const form = useAppForm({
    defaultValues: {
      id: transaction?.id,
      description: transaction?.description ?? '',
      category_id: transaction?.category_id ?? '',
      account_id: transaction?.account_id ?? accounts.at(0)?.id,
      date: transaction?.date ?? formatISO(new Date()),
      amount: Math.abs(transaction?.amount ?? 0),
      transaction_type: type,
    } as TransactionsInsert,
    validators: {
      onSubmit: addTransactionsSchema,
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
          children={(field) => <field.TransactionAmountField type={type} />}
        />
      </div>
      <div className="flex flex-col gap-3">
        <form.AppField
          name="account_id"
          children={(field) => <field.AccountsCardField label="Cuenta" />}
        />
        <form.AppField
          name="category_id"
          children={(field) => <field.CategoriesCardField label="Categoría" type={type} />}
        />
        <form.AppField
          name="description"
          children={(field) => (
            <field.InputCardField
              icon={<FileTextIcon />}
              label="Notas"
              placeholder="Notas de la transacción"
            />
          )}
        />
        <form.AppField name="date" children={(field) => <field.DateField label="Fecha" />} />

        <Footer>
          <form.AppForm>
            <form.SubmitButton>
              {isEdit ? 'Editar' : 'Agregar'} {type === 'expense' ? 'gasto' : 'ingreso'}
            </form.SubmitButton>
          </form.AppForm>
        </Footer>
      </div>
    </form>
  );
}
