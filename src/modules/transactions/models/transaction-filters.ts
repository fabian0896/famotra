import type { TransactionTypes } from './transactions.models';

export interface TransactionFilters {
  from?: string;
  to?: string;
  categoryId?: string;
  accountId?: string;
  transactionType?: TransactionTypes;
}

export const EMPTY_FILTERS: TransactionFilters = {};
