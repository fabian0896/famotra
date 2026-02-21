import {
  ArrowRightIcon,
  ArrowRightLeftIcon,
  Edit2Icon,
  SettingsIcon,
  Trash2Icon,
} from 'lucide-react';
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
import { AccountIcon, AccountName } from '@/modules/accounts/components/account-icon';
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
import { LocalDateFormat } from '@/components/local-date-format';

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
        <AccountIcon account={transaction.account} className="size-10 rounded-2xl bg-secondary" />
        <div className="flex flex-col gap-0.5">
          <AccountName
            account={transaction.account}
            as="p"
            part="account"
            className="text-sm font-semibold text-foreground text-center"
          />
          <AccountName
            account={transaction.account}
            as="p"
            part="bank"
            className="text-[12px] text-muted-foreground font-medium text-center"
          />
        </div>
      </div>
      <div className="size-8 rounded-full bg-primary grid place-items-center">
        <ArrowRightIcon className="size-4 stroke-3 text-primary-foreground" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center gap-1.5">
        <p className="text-[12px] text-muted-foreground font-medium">Destino</p>
        <AccountIcon
          account={transaction.destination}
          className="size-10 rounded-2xl bg-secondary"
        />
        <div className="flex flex-col gap-0.5">
          <AccountName
            account={transaction.destination}
            as="p"
            part="account"
            className="text-sm font-semibold text-foreground text-center"
          />
          <AccountName
            account={transaction.destination}
            as="p"
            part="bank"
            className="text-[12px] text-muted-foreground font-medium text-center"
          />
        </div>
      </div>
    </div>
  );
}

export function TransactionDetail({
  children,
  transaction,
  onRemove,
}: {
  children?: React.ReactNode;
  transaction: Transaction;
  onRemove?: () => void;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const remove = useMutation({
    mutationFn: Transactions.remove,
    onSuccess: () => {
      sileo.success({ title: 'Transacción eliminada correctamente' });
      setIsOpen(false);
      onRemove?.();
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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="px-6 py-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <CategoryIcon
              className="size-14 rounded-2xl mx-auto"
              transactionType={transaction.transaction_type}
              category={transaction.category}
            />
            <DrawerTitle className="text-xl font-bold text-foreground text-center">
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
              <LocalDateFormat className="text-sm text-foreground font-semibold first-letter:uppercase lowercase">
                {transaction.date}
              </LocalDateFormat>
            </div>
            {transaction.transaction_type !== 'transfer' && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground font-medium">Cuenta</p>
                {transaction.account ? (
                  <div className="text-sm text-foreground font-semibold flex items-center gap-2">
                    <AccountIcon className="size-5 rounded" account={transaction.account} />
                    <AccountName as="p" account={transaction.account} />
                  </div>
                ) : (
                  <span className="py-1 px-2.5 bg-amber-400/10 text-[12px] font-semibold text-amber-400 rounded-[6px] flex items-center">
                    <SettingsIcon className="size-3.5 me-1.5" />
                    Configurar cuenta
                  </span>
                )}
              </div>
            )}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">Categoría</p>
              {transaction.transaction_type === 'transfer' ? (
                <span className="py-1 px-2.5 bg-primary/10 text-[12px] font-semibold text-primary rounded-[6px] flex gap-1.5 items-center">
                  <ArrowRightLeftIcon className="size-3 stroke-3" />
                  Transferencia
                </span>
              ) : transaction.category_id ? (
                <span
                  style={{ '--color': transaction.category?.color } as React.CSSProperties}
                  className="py-1 px-2.5 bg-(--color)/10 text-[12px] font-semibold text-(--color) rounded-[6px]"
                >
                  {transaction.category?.icon} {transaction.category?.name || 'Sin categoría'}
                </span>
              ) : (
                <span className="py-1 px-2.5 bg-amber-400/10 text-[12px] font-semibold text-amber-400 rounded-[6px] flex items-center">
                  <SettingsIcon className="size-3.5 me-1.5" />
                  Configurar categoría
                </span>
              )}
            </div>
            {transaction.card && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground font-medium">Tarjeta</p>
                <p className="text-sm text-foreground font-semibold">{transaction.card.name}</p>
              </div>
            )}
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
