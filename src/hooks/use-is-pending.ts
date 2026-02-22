import { useMemo } from 'react';
import type { Transaction } from '@/modules/transactions/models/transactions.models';

export function useIsPending(transaction: Transaction) {
  return useMemo(() => {
    return !transaction.account_id || !transaction.category_id;
  }, [transaction]);
}
