import type { Transaction } from '@/modules/transactions/models/transactions.models';

export function useIsPending(transaction: Transaction) {
  return (
    transaction.transaction_type !== 'transfer' &&
    (!transaction.account_id || !transaction.category_id)
  );
}
