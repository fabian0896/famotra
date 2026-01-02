import type { Enums, Tables, TablesInsert } from './database.types';

export type TransactionAccount = {
  id: string;
  name: string;
  bank: {
    id: string;
    logo: string;
    name: string;
  } | null;
};
export type Transaction = Tables<'transactions'> & {
  category: {
    id: string;
    name: string;
    icon: string;
  } | null;
  account: TransactionAccount;
  destination: TransactionAccount | null;
};
export type TransactionsInsert = TablesInsert<'transactions'>;
export type TransactionTypes = Enums<'transaction_type'>;
export const TRANSACTION_TYPES: Record<TransactionTypes, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
};
