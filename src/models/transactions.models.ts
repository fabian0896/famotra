import type { Enums, Tables, TablesInsert } from './database.types';

export type TransactionAccount = {
  name: string;
  bank: {
    id: string;
    logo: string;
    name: string;
  } | null;
};
export type Transaction = Tables<'transactions'> & {
  category: {
    name: string;
    icon: string;
  };
  account: TransactionAccount;
  destination: TransactionAccount;
};
export type TransactionsInsert = TablesInsert<'transactions'>;
export type TransactionTypes = Enums<'transaction_type'>;
export const TRANSACTION_TYPES: Record<TransactionTypes, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
};
