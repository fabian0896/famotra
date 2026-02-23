import { CircleCheckIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { tv } from 'tailwind-variants';
import type { Transaction } from '@/modules/transactions/models/transactions.models';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { LocalDateFormat } from '@/components/local-date-format';
import { Swipeable } from '@/components/swipeable';
import { CategoryIcon } from '@/modules/categories/components/category-icon';
import { DeleteTransactionDialog } from '@/modules/transactions/components/delete-transacion-dialog';
import { TransactionDetail } from '@/modules/transactions/components/transaction-detail';
import { useIsPending } from '@/hooks/use-is-pending';

const description = tv({
  base: 'text-sm font-semibold text-foreground mb-0.5 line-clamp-1',
  variants: {
    pending: {
      true: 'text-amber-500',
    },
  },
});

export function TransactionResumeItem({ transaction }: { transaction: Transaction }) {
  const pending = useIsPending(transaction);

  return (
    <Swipeable as="li">
      <TransactionDetail transaction={transaction}>
        <Swipeable.Item>
          <button className="p-3.5 flex gap-3.5 items-center w-full text-left transition-all active:bg-muted rounded-2xl overflow-hidden bg-card">
            <CategoryIcon
              className="size-11 rounded-xl text-sm"
              transactionType={transaction.transaction_type}
              category={transaction.category}
            />
            <div className="flex-1 flex flex-col">
              <p className={description({ pending })}>{transaction.description}</p>
              <LocalDateFormat
                formatStr="d 'de' MMMM"
                className="text-xs text-muted-foreground font-normal"
              >
                {transaction.date}
              </LocalDateFormat>
            </div>
            <div>
              <FormattedMoneyTransaction
                className="text-sm font-bold"
                transactionType={transaction.transaction_type}
                value={transaction.amount}
              />
            </div>
          </button>
        </Swipeable.Item>
      </TransactionDetail>
      <Swipeable.Actions>
        <Swipeable.Action
          className={pending ? 'bg-amber-300 text-amber-800' : 'bg-primary text-primary-foreground'}
        >
          {pending ? <CircleCheckIcon className="mb-1" /> : <PencilIcon className="mb-1" />}
          <span className="font-semibold text-[11px]">{pending ? 'Completar' : 'Editar'}</span>
        </Swipeable.Action>
        <DeleteTransactionDialog transactionId={transaction.id}>
          <Swipeable.Action className="bg-red-400 text-red-50">
            <Trash2Icon className="size-5 mb-1" />
            <span className="font-semibold text-[11px]">Borrar</span>
          </Swipeable.Action>
        </DeleteTransactionDialog>
      </Swipeable.Actions>
    </Swipeable>
  );
}
