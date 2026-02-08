import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatISO } from 'date-fns';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { addTransferSchema } from '../models/schemas';
import { Transactions } from '../services/transactions';
import type { Transaction, TransactionsInsert } from '../models/transactions.models';
import { QueryKeys } from '@/constants/query-keys';
import { useAppForm } from '@/hooks/form';
import { formatError } from '@/lib/format-error';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function TransferForm({
  transaction,
  onSuccess,
}: {
  transaction?: Transaction;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const isEdit = Boolean(transaction);

  const create = useMutation({
    mutationFn: Transactions.create,
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
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACCOUNTS] });
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
              children={(field) => <field.AmountField label="Monto" />}
            />
            <form.AppField
              name="description"
              children={(field) => <field.TextField label="Descripción" />}
            />
          </div>
          <div className="flex gap-2.5 items-end">
            <div className="flex-1">
              <form.AppField
                name="account_id"
                children={(field) => <field.AccountsField label="Desde" />}
              />
              <Link to="/dashboard/accounts" className="text-sm inline-block mt-2 text-primary">
                + Agregar Cuenta
              </Link>
            </div>
            <div className="h-9 flex items-center mb-7">
              <ArrowRight strokeWidth={2.5} size="20" />
            </div>
            <div className="flex-1">
              <form.AppField
                name="destination_account_id"
                children={(field) => <field.AccountsField label="Hasta" />}
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
            <form.SubmitButton>{isEdit ? 'Editar' : 'Agregar'} Transferencia</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </form>
    </React.Fragment>
  );
}
