import { ArrowRightIcon, ArrowRightLeftIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { sileo } from 'sileo';
import { Transactions } from '../services/transactions';
import type { Transaction } from '../models/transactions.models';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { AccountIcon } from '@/modules/accounts/components/account-icon';
import { CategoryIcon } from '@/modules/categories/components/category-icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { QueryKeys } from '@/constants/query-keys';
import { formatError } from '@/lib/format-error';

function DeleteConfirmationDialog({
  onConfirm,
  children,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-500/15">
            <Trash2Icon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar transacción?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            <Trash2Icon />
            Si, Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TransferDetails({ transaction }: { transaction: Transaction }) {
  return (
    <div className="bg-muted p-3 rounded-2xl flex gap-3 items-center">
      <div className="flex-1 flex flex-col justify-center items-center gap-1.5">
        <p className="text-[12px] text-muted-foreground font-medium">Origen</p>
        <div className="size-10 rounded-2xl bg-secondary overflow-hidden">
          <img src={transaction.account?.bank?.logo} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground text-center">
            {transaction.account?.name}
          </p>
          <p className="text-[12px] text-muted-foreground font-medium text-center">
            {transaction.account?.bank?.name}
          </p>
        </div>
      </div>
      <div className="size-8 rounded-full bg-primary grid place-items-center">
        <ArrowRightIcon className="size-4 stroke-3 text-primary-foreground" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center gap-1.5">
        <p className="text-[12px] text-muted-foreground font-medium">Destino</p>
        <div className="size-10 rounded-2xl bg-secondary overflow-hidden">
          <img src={transaction.destination?.bank?.logo} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground text-center">
            {transaction.destination?.name}
          </p>
          <p className="text-[12px] text-muted-foreground font-medium text-center">
            {transaction.destination?.bank?.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TransactionDetail({
  children,
  transaction,
}: {
  children?: React.ReactNode;
  transaction: Transaction;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const remove = useMutation({
    mutationFn: Transactions.remove,
    onSuccess: () => {
      sileo.success({
        title: 'Transacción eliminada',
        description: 'La transacción ha sido eliminada correctamente.',
      });
      setIsOpen(false);
    },
    onError: (error) => {
      const { message } = formatError(error);
      sileo.error({
        title: 'Error al eliminar',
        description: message,
      });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
    },
  });

  const localDate = `${transaction.date}T12:00:00`;
  const date = format(localDate, 'MMMM d, yyyy', { locale: es });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="px-6 py-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <CategoryIcon className="size-14 rounded-2xl mx-auto" transaction={transaction} />
            <DrawerTitle className="text-2xl font-bold text-foreground text-center">
              {transaction.transaction_type === 'transfer' ? (
                <span>{`Transferencia a ${transaction.destination?.name}`}</span>
              ) : (
                <span>{transaction.description}</span>
              )}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              <FormattedMoneyTransaction
                className="text-center text-3xl font-bold"
                transactionType={transaction.transaction_type}
                value={transaction.amount}
              />
            </DrawerDescription>
          </div>
          {transaction.transaction_type === 'transfer' ? (
            <TransferDetails transaction={transaction} />
          ) : null}
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">Fecha</p>
              <p className="text-sm text-foreground font-semibold first-letter:uppercase lowercase">
                {date}
              </p>
            </div>
            {transaction.transaction_type !== 'transfer' && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground font-medium">Cuenta</p>
                <div className="text-sm text-foreground font-semibold flex items-center gap-2">
                  <AccountIcon className="w-5 rounded" account={transaction.account} />
                  <p>
                    {transaction.account?.bank?.name} - {transaction.account?.name}
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">Categoría</p>
              {transaction.transaction_type === 'transfer' ? (
                <span className="py-1 px-2.5 bg-primary/10 text-[12px] font-semibold text-primary rounded-[6px] flex gap-1.5 items-center">
                  <ArrowRightLeftIcon className="size-3 stroke-3" />
                  Transferencia
                </span>
              ) : (
                <span className="py-1 px-2.5 bg-primary/10 text-[12px] font-semibold text-primary rounded-[6px]">
                  {transaction.category?.icon} {transaction.category?.name || 'Sin categoría'}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">Notas</p>
              <p className="text-sm text-foreground font-semibold">{transaction.description}</p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3">
            <Button className="flex-1 h-12" variant="outline">
              <Edit2Icon />
              Editar
            </Button>
            <DeleteConfirmationDialog onConfirm={() => remove.mutate({ id: transaction.id })}>
              <Button disabled={remove.isPending} className="flex-1 h-12" variant="destructive">
                {remove.isPending ? <Spinner /> : <Trash2Icon />}
                Borrar
              </Button>
            </DeleteConfirmationDialog>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
