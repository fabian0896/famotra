import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { formatISO } from 'date-fns';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import type { TransactionsInsert } from '@/models/transactions.models';
import { useAppForm } from '@/hooks/form';
import { accountsQueryOptions, totalBalancesQueryOptions } from '@/query-options/accounts';
import { Transactions } from '@/services/transactions';
import { transactionsQueryOptions } from '@/query-options/transactions';
import { formatError } from '@/lib/format-error';

const addTransactionsSchema = z.object({
  description: z.string(),
  category_id: z.uuidv4(),
  account_id: z.uuidv4(),
  amount: z.number(),
  date: z.string(),
});

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: accounts } = useQuery(accountsQueryOptions);

  const create = useMutation({
    mutationFn: Transactions.create,
    onSuccess: () => {
      toast.success('Transaccion creade correctamente!');
    },
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: accountsQueryOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: totalBalancesQueryOptions.queryKey });
    },
  });

  const form = useAppForm({
    defaultValues: {
      description: '',
      category_id: '',
      account_id: accounts?.at(0)?.id,
      amount: 0,
      date: formatISO(new Date()),
      transaction_type: 'expense',
    } as TransactionsInsert,
    validators: {
      onSubmit: addTransactionsSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value);
      setOpen(false);
      formApi.reset();
    },
  });

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger type="button" asChild>
        <Button type="button">
          <Plus />
          Nueva Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader className="mb-6">
            <DialogTitle>Nueva Transacción</DialogTitle>
            <DialogDescription>
              Agrega una nueva transacción a tu registro financiero.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 mb-6">
            <Tabs>
              <TabsList className="w-full">
                <TabsTrigger value="gasto">Gasto</TabsTrigger>
                <TabsTrigger value="ingreso">Ingreso</TabsTrigger>
                <TabsTrigger value="transferencia">Transferencias</TabsTrigger>
              </TabsList>
            </Tabs>
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
              <form.AppField
                name="category_id"
                children={(field) => <field.CategoryField type="expenses" label="Categoría" />}
              />
              <form.AppField
                name="account_id"
                children={(field) => <field.AccountsField label="Cuenta" />}
              />
            </div>
            <form.AppField name="date" children={(field) => <field.DateField label="Fecha" />} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Agregar Gasto</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
