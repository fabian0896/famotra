import React, { useEffect, useState } from 'react';
import { TabsContent } from '@radix-ui/react-tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { TransactionForm } from './transaction-form';
import { TransferForm } from './transfer-form';
import type { Transaction } from '@/modules/transactions/models/transactions.models';

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
