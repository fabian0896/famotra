import { CircleCheckIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { DeleteTransactionDialog } from './delete-transacion-dialog';
import type { Transaction } from '../models/transactions.models';
import { Swipeable } from '@/components/swipeable';
import { useIsPending } from '@/hooks/use-is-pending';

export function TransactionsSwipeableActions({ transaction }: { transaction: Transaction }) {
  const pending = useIsPending(transaction);
  return (
    <Swipeable.Actions>
      <Swipeable.Action
        className={pending ? 'bg-amber-300 text-amber-800' : 'bg-primary text-primary-foreground'}
      >
        {pending ? <CircleCheckIcon className="mb-1" /> : <PencilIcon className="mb-1" />}
        <span className="font-semibold text-[11px]">{pending ? 'Completar' : 'Editar'}</span>
      </Swipeable.Action>
      <DeleteTransactionDialog transactionId={transaction.id}>
        <Swipeable.Action className="bg-red-400 text-red-50 rounded-r-2xl">
          <Trash2Icon className="size-5 mb-1" />
          <span className="font-semibold text-[11px]">Borrar</span>
        </Swipeable.Action>
      </DeleteTransactionDialog>
    </Swipeable.Actions>
  );
}
