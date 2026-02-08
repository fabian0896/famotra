import type { TransactionTypes } from './transactions.models';

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string;
  accountId?: string;
  transactionType?: TransactionTypes;
}

export const EMPTY_FILTERS: TransactionFilters = {};
