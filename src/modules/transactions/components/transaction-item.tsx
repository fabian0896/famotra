import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangleIcon,
  ArrowRight,
  BookCheckIcon,
  Edit2,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { cva } from 'class-variance-authority';
import { Link } from '@tanstack/react-router';
import { Transactions } from '../services/transactions';
import { CreateEditTransactionDialog } from './add-transaction-dialog';
import type { Transaction } from '../models/transactions.models';
import { QueryKeys } from '@/constants/query-keys';
import { FormattedMoney } from '@/components/formatted-money';
import { formatError } from '@/lib/format-error';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AccountIcon } from '@/modules/accounts/components/account-icon';
import { cn } from '@/lib/utils';

const cardClx = cva('flex flex-row items-center gap-4 p-3 w-full', {
  variants: {
    pending: {
      true: 'bg-amber-50/10 border-amber-600',
    },
  },
});

export function TransactionItem({
  transaction,
  className,
  ...props
}: { transaction: Transaction } & React.ComponentProps<'li'>) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Transactions.remove,
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: accountsQueryOptions.queryKey });
      return queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
    },
  });

  const pending =
    transaction.transaction_type !== 'transfer' &&
    (!transaction.category_id || !transaction.account_id);

  return (
    <li className={cn('block', className)} {...props}>
      <Card className={cardClx({ pending, className })}>
        {transaction.transaction_type === 'transfer' ? (
          <Transfer transaction={transaction} />
        ) : (
          <IncomeExpense transaction={transaction} />
        )}
        {pending ? (
          <Button onClick={() => setEditDialogOpen(true)} size="icon" variant="ghost">
            <BookCheckIcon className="text-amber-500" />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit2 />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={remove.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  remove.mutate({ id: transaction.id });
                }}
                variant="destructive"
              >
                {remove.isPending ? <Spinner /> : <Trash2 />}
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </Card>
      <CreateEditTransactionDialog
        isOpen={editDialogOpen}
        transaction={transaction}
        onOpenChange={setEditDialogOpen}
      />
    </li>
  );
}

function TransactionIcon({ transaction }: { transaction: Transaction }) {
  if (!transaction.category) {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
        <AlertTriangleIcon strokeWidth={2.5} size={20} className="text-amber-600" />
      </div>
    );
  }

  return (
    <div className="text-xs leading-none flex items-center justify-center bg-primary/20 w-10 h-10 rounded-full">
      {transaction.category.icon}
    </div>
  );
}

function IncomeExpense({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex gap-4 items-center flex-1">
        <TransactionIcon transaction={transaction} />
        {transaction.category ? (
          <div className="flex-1">
            <p className="text-foreground font-medium mb-0.6 line-clamp-1">
              {transaction.description}
            </p>
            <p className="text-sm text-muted-foreground">{transaction.category.name}</p>
          </div>
        ) : (
          <div className="flex-1">
            <Link
              to="/dashboard/shortcuts"
              search={{ tab: 'merchants' }}
              className="font-medium mb-0.6 line-clamp-1 text-amber-500 underline decoration-dotted"
            >
              {transaction.description}
            </Link>
            <p className="text-sm text-muted-foreground">Sin categoría</p>
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <AccountIcon account={transaction.account} className="w-6 h-6 rounded-full" />
        {transaction.account ? (
          <div>
            <p className="text-sm text-foreground font-base">{transaction.account.name}</p>
            <p className="text-xs text-muted-foreground">
              {transaction.account.bank?.name || transaction.account.custom_bank_name}
            </p>
          </div>
        ) : (
          <div>
            <Link
              to="/dashboard/shortcuts"
              search={{ tab: 'cards' }}
              className="text-sm text-amber-500 font-base underline decoration-dotted"
            >
              {transaction.card?.name || 'No registra'}
            </Link>
            <p className="text-xs text-muted-foreground">Sin cuenta vinculada</p>
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-end">
        <FormattedMoney value={transaction.amount} />
      </div>
    </div>
  );
}

function Transfer({ transaction }: { transaction: Transaction }) {
  if (!transaction.destination || !transaction.account) {
    throw new Error('Transfer componente needs a destination and an account');
  }
  return (
    <div className="flex flex-row items-center gap-4 rounded-lg w-full">
      <div className="flex gap-4 items-center flex-1">
        <div className="text-xs leading-none flex items-center justify-center bg-primary/20 w-10 h-10 rounded-full overflow-hidden">
          <AccountIcon account={transaction.account} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-foreground font-medium mb-0.6 line-clamp-1">
            {transaction.account.name}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {transaction.account.bank?.name}
          </p>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <ArrowRight strokeWidth={2.5} className="text-red-400" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <FormattedMoney className="mb-1" value={transaction.amount} />
        <p className="text-xs text-muted-foreground text-center">{transaction.description}</p>
      </div>
      <div className="flex-1 flex justify-center">
        <ArrowRight strokeWidth={2.5} className="text-green-400" />
      </div>
      <div className="flex gap-4 items-center flex-1 justify-end">
        <div className="flex-1">
          <p className="text-foreground font-medium mb-0.6 line-clamp-1 text-right">
            {transaction.destination.name}
          </p>
          <p className="text-sm text-muted-foreground text-right line-clamp-1">
            {transaction.destination.bank?.name || transaction.destination.custom_bank_name}
          </p>
        </div>
        <div className="text-xs leading-none flex items-center justify-center bg-primary/20 w-10 h-10 rounded-full overflow-hidden">
          <AccountIcon account={transaction.destination} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
