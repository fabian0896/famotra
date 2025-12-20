import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { formatISO } from 'date-fns';
import { toast } from 'sonner';
import { TabsContent } from '@radix-ui/react-tabs';
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
import type { CategoryTypes } from '@/models/categories.models';
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

function TransactionForm({ type, onSuccess }: { type: CategoryTypes; onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const { data: accounts } = useQuery(accountsQueryOptions);

  const create = useMutation({
    mutationFn: Transactions.create,
    onSuccess: () => {
      toast.success('Transaccion creade correctamente!');
      onSuccess?.();
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
            <form.AppField
              name="category_id"
              children={(field) => <field.CategoryField type={type} label="Categoría" />}
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
            <form.SubmitButton>
              Agregar {type === 'expense' ? 'Gasto' : 'Ingreso'}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </form>
    </React.Fragment>
  );
}

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
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
        <Tabs defaultValue="expense">
          <DialogHeader className="mb-6">
            <DialogTitle>Nueva Transacción</DialogTitle>
            <DialogDescription>
              Agrega una nueva transacción a tu registro financiero.
            </DialogDescription>
            <TabsList className="w-full mt-4">
              <TabsTrigger value="expense">Gasto</TabsTrigger>
              <TabsTrigger value="income">Ingreso</TabsTrigger>
              <TabsTrigger value="transfer">Transferencias</TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value="expense">
            <TransactionForm onSuccess={() => setOpen(false)} type="expense" />
          </TabsContent>
          <TabsContent value="income">
            <TransactionForm onSuccess={() => setOpen(false)} type="income" />
          </TabsContent>
          <TabsContent value="transfer">
            <TransactionForm type="expense" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
