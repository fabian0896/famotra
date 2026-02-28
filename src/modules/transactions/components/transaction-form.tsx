import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatISO } from 'date-fns';
import { FileTextIcon } from 'lucide-react';
import { Transactions } from '../services/transactions';
import { addTransactionsSchema } from '../models/schemas';
import type { Transaction, TransactionsInsert } from '../models/transactions.models';
import type { CategoryTypes } from '@/modules/categories/models/categories.models';
import { QueryKeys } from '@/constants/query-keys';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { formatError } from '@/lib/format-error';
import { useAppForm } from '@/hooks/form';

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
  const { data } = useQuery(accountsQueryOptions);
  const accounts = data?.accounts || [];

  const create = useMutation({
    mutationFn: Transactions.upsert,
    onSuccess: () => {
      toast.success('Transaccion creada correctamente!');
      onSuccess?.();
    },
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: accountsQueryOptions.queryKey });
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
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value);
      formApi.reset();
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
      <div className="flex flex-col gap-2 items-center py-6">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="">
          Valor
        </label>
        <input
          className="text-5xl font-bold text-red-400 w-full text-center outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col gap-3">
        <form.AppField
          name="account_id"
          children={(field) => <field.AccountsCardField label="Cuenta" />}
        />
        <form.AppField
          name="category_id"
          children={(field) => <field.CategoriesCardField label="Categoría" type="expense" />}
        />
        <form.AppField
          name="description"
          children={(field) => (
            <field.InputCardField
              icon={<FileTextIcon />}
              label="Notas"
              placeholder="Notas de la trasnferencias"
            />
          )}
        />
        <form.AppField name="date" children={(field) => <field.DateField label="Fecha" />} />
      </div>
    </form>
  );
}
