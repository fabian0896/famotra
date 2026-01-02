import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatISO } from 'date-fns';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { Transactions } from '../services/transactions';
import { transactionsQueryOptions } from '../query-options/transactions';
import { addTransactionsSchema } from '../models/schemas';
import type { Transaction, TransactionsInsert } from '../models/transactions.models';
import type { CategoryTypes } from '@/modules/categories/models/categories.models';
import { accountsQueryOptions } from '@/query-options/accounts';
import { formatError } from '@/lib/format-error';
import { useAppForm } from '@/hooks/form';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

  const isEdit = Boolean(transaction);

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
      queryClient.invalidateQueries({ queryKey: transactionsQueryOptions.queryKey });
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
    <React.Fragment>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <form.AppField
              name="amount"
              children={(field) => <field.AmountField label="Valor" />}
            />
            <form.AppField
              name="description"
              children={(field) => <field.TextField label="Descripción" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <form.AppField
                name="category_id"
                children={(field) => <field.CategoryField type={type} label="Categoría" />}
              />
              <Link to="/dashboard/categories" className="text-sm inline-block mt-2 text-primary">
                + Agregar Categoría
              </Link>
            </div>
            <div>
              <form.AppField
                name="account_id"
                children={(field) => <field.AccountsField label="Cuenta" />}
              />
              <Link to="/dashboard/accounts" className="text-sm inline-block mt-2 text-primary">
                + Agregar Cuenta
              </Link>
            </div>
          </div>
          <form.AppField name="date" children={(field) => <field.DateField label="Fecha" />} />
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton>
              {isEdit ? 'Editar' : 'Agregar'} {type === 'expense' ? 'Gasto' : 'Ingreso'}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </form>
    </React.Fragment>
  );
}
