import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { Transactions } from '../services/transactions';
import { transactionsQueryOptions } from '../query-options/transactions';
import { CreateEditTransactionDialog } from './add-transaction-dialog';
import { FormattedMoney } from './formatted-money';
import type { Transaction } from '../models/transactions.models';
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

export function TransactionItem({ transaction }: { transaction: Transaction }) {
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
      return queryClient.invalidateQueries({ queryKey: transactionsQueryOptions.queryKey });
    },
  });

  return (
    <li className="block">
      <Card className="flex flex-row items-center gap-4 p-3 w-full">
        {transaction.transaction_type === 'transfer' ? (
          <Transfer transaction={transaction} />
        ) : (
          <IncomeExpense transaction={transaction} />
        )}
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
      </Card>
      <CreateEditTransactionDialog
        isOpen={editDialogOpen}
        transaction={transaction}
        onOpenChange={setEditDialogOpen}
      />
    </li>
  );
}

function IncomeExpense({ transaction }: { transaction: Transaction }) {
  if (!transaction.category) throw new Error('The IncomeExpense component needs a category');
  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex gap-4 items-center flex-1">
        <div className="text-xs leading-none flex items-center justify-center bg-primary/20 w-10 h-10 rounded-full">
          {transaction.category.icon}
        </div>
        <div className="flex-1">
          <p className="text-foreground font-medium mb-0.6 line-clamp-1">
            {transaction.description}
          </p>
          <p className="text-sm text-muted-foreground">{transaction.category.name}</p>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <img
          src={transaction.account.bank?.logo}
          alt={transaction.account.bank?.name}
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p className="text-sm text-foreground font-base">{transaction.account.name}</p>
          <p className="text-xs text-muted-foreground">{transaction.account.bank?.name}</p>
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <FormattedMoney value={transaction.amount} />
      </div>
    </div>
  );
}

function Transfer({ transaction }: { transaction: Transaction }) {
  if (!transaction.destination) throw new Error('Transfer componente needs a destination');
  return (
    <div className="flex flex-row items-center gap-4 rounded-lg w-full">
      <div className="flex gap-4 items-center flex-1">
        <div className="text-xs leading-none flex items-center justify-center bg-primary/20 w-10 h-10 rounded-full overflow-hidden">
          <img
            src={transaction.account.bank?.logo}
            alt={transaction.account.bank?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-foreground font-medium mb-0.6 line-clamp-1">
            {transaction.account.name}
          </p>
          <p className="text-sm text-muted-foreground">{transaction.account.bank?.name}</p>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <ArrowRight strokeWidth={2.5} className="text-red-400" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <FormattedMoney className="mb-1" neutral value={transaction.amount} />
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
          <p className="text-sm text-muted-foreground text-right">
            {transaction.destination.bank?.name}
          </p>
        </div>
        <div className="text-xs leading-none flex items-center justify-center bg-primary/20 w-10 h-10 rounded-full overflow-hidden">
          <img
            src={transaction.destination.bank?.logo}
            alt={transaction.destination.bank?.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
