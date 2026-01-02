import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { formatISO } from 'date-fns';
import { toast } from 'sonner';
import { TabsContent } from '@radix-ui/react-tabs';
import { Link } from '@tanstack/react-router';
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
import type { Transaction, TransactionsInsert } from '@/models/transactions.models';
import type { CategoryTypes } from '@/models/categories.models';
import { useAppForm } from '@/hooks/form';
import { accountsQueryOptions } from '@/query-options/accounts';
import { Transactions } from '@/services/transactions';
import { transactionsQueryOptions } from '@/query-options/transactions';
import { formatError } from '@/lib/format-error';

const addTransactionsSchema = z.object({
  id: z.union([z.string(), z.undefined()]),
  description: z.string().nonempty({ message: 'La descripción es requedrida' }),
  category_id: z.uuidv4({ message: 'Debe seleccionar una categoría válida' }),
  account_id: z.uuidv4({ message: 'Debe seleccionar una cuenta válida' }),
  amount: z.number().refine((val) => val !== 0, {
    message: 'El monto debe ser diferente de 0',
  }),
  date: z.string(),
});

const addTransferSchema = addTransactionsSchema.extend({
  destination_account_id: z.uuidv4({ message: 'Debe seleccionar una cuenta válida' }),
  transaction_type: z.literal('transfer'),
  category_id: z.uuidv4().optional(),
});

function TransactionForm({
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

function TransferForm({
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
      queryClient.invalidateQueries({ queryKey: transactionsQueryOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: accountsQueryOptions.queryKey });
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

export function CreateEditTransactionDialog({
  children,
  isOpen,
  transaction,
  onOpenChange,
}: {
  children?: React.ReactNode;
  isOpen?: boolean;
  transaction?: Transaction;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('');

  const isEdit = Boolean(transaction);

  const handleClose = (state: boolean) => {
    onOpenChange?.(state);
    setOpen(state);
  };

  useEffect(() => {
    if (isOpen === undefined) return;
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!transaction) return;
    setTab(transaction.transaction_type);
  }, [transaction]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger type="button" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Tabs value={tab} onValueChange={setTab} defaultValue="expense">
          <DialogHeader className="mb-6">
            <DialogTitle>{isEdit ? 'Editar Transacción' : 'Nueva Transacción'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Edita tu transacción con los nuevos datos'
                : 'Agrega una nueva transacción a tu registro financiero.'}
            </DialogDescription>
            <TabsList className="w-full mt-4">
              <TabsTrigger value="expense">Gasto</TabsTrigger>
              <TabsTrigger value="income">Ingreso</TabsTrigger>
              <TabsTrigger value="transfer">Transferencias</TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value="expense">
            <TransactionForm
              transaction={transaction}
              onSuccess={() => handleClose(false)}
              type="expense"
            />
          </TabsContent>
          <TabsContent value="income">
            <TransactionForm
              transaction={transaction}
              onSuccess={() => handleClose(false)}
              type="income"
            />
          </TabsContent>
          <TabsContent value="transfer">
            <TransferForm transaction={transaction} onSuccess={() => handleClose(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
