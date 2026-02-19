import { Edit2Icon, Trash2Icon } from 'lucide-react';
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

export function TransactionDetail({
  children,
  transaction,
}: {
  children?: React.ReactNode;
  transaction: Transaction;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="px-6 py-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <CategoryIcon className="size-14 rounded-2xl mx-auto" transaction={transaction} />
            <DrawerTitle className="text-2xl font-bold text-foreground text-center">
              {transaction.description}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              <FormattedMoneyTransaction
                className="text-center text-3xl font-bold"
                transactionType={transaction.transaction_type}
                value={transaction.amount}
              />
            </DrawerDescription>
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">Fecha</p>
              <p className="text-sm text-foreground font-semibold">{transaction.date}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">Cuenta</p>
              <div className="text-sm text-foreground font-semibold flex items-center gap-2">
                <AccountIcon className="w-5 rounded" account={transaction.account} />
                <p>
                  {transaction.account?.bank?.name} - {transaction.account?.name}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">Categoría</p>
              <span className="py-1 px-2.5 bg-primary/10 text-[12px] font-semibold text-primary rounded-[6px]">
                {transaction.category?.icon} {transaction.category?.name || 'Sin categoría'}
              </span>
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
            <Button className="flex-1 h-12" variant="destructive">
              <Trash2Icon />
              Borrar
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
