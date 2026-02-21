import type { Enums, Tables, TablesInsert } from '@/models/database.types';

export type TransactionAccount = {
  id: string;
  name: string;
  custom_bank_name: string | null;
  custom_bank_icon: string | null;
  bank: {
    id: string;
    logo: string;
    name: string;
  } | null;
};
export type TransactionCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};
export type Transaction = Tables<'transactions'> & {
  category: TransactionCategory | null;
  card: { name: string } | null;
  account: TransactionAccount | null;
  destination: TransactionAccount | null;
};
export type TransactionsInsert = TablesInsert<'transactions'>;
export type TransactionTypes = Enums<'transaction_type'>;
export const TRANSACTION_TYPES: Record<TransactionTypes, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
};
