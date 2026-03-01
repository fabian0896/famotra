import { CircleCheckIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { DeleteTransactionDialog } from './delete-transacion-dialog';
import type { Transaction } from '../models/transactions.models';
import { Swipeable } from '@/components/swipeable';
import { useIsPending } from '@/hooks/use-is-pending';
import { cn } from '@/lib/utils';

export function TransactionsSwipeableActions({
  transaction,
  className,
}: {
  transaction: Transaction;
  className?: string;
}) {
  const pending = useIsPending(transaction);
  return (
    <Swipeable.Actions>
      <Swipeable.Action
        asChild
        className={pending ? 'bg-amber-300 text-amber-800' : 'bg-primary text-primary-foreground'}
      >
        <Link to="/dashboard/transactions/$id/edit" params={{ id: transaction.id }}>
          {pending ? <CircleCheckIcon className="mb-1" /> : <PencilIcon className="mb-1" />}
          <span className="font-semibold text-[11px]">{pending ? 'Completar' : 'Editar'}</span>
        </Link>
      </Swipeable.Action>
      <DeleteTransactionDialog transactionId={transaction.id}>
        <Swipeable.Action className={cn('bg-red-400 text-red-50 rounded-r-2xl', className)}>
          <Trash2Icon className="size-5 mb-1" />
          <span className="font-semibold text-[11px]">Borrar</span>
        </Swipeable.Action>
      </DeleteTransactionDialog>
    </Swipeable.Actions>
  );
}
