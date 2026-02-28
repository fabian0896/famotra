import type { TransactionTypes } from './transactions.models';

export interface TransactionFilters {
  from?: string;
  to?: string;
  categoryIds?: string[];
  accountIds?: string[];
  transactionType?: TransactionTypes;
}

export const EMPTY_FILTERS: TransactionFilters = {};
