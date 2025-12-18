import type { Enums, Tables, TablesInsert, TablesUpdate } from './database.types';

export type Category = Tables<'categories'>;

export type CategoryInsert = TablesInsert<'categories'>;

export type CategoryUpdate = TablesUpdate<'categories'>;

export type TransactionType = Enums<'transaction_type'>;

export type CategoryDelete = { id: string };

export const TRANSACTION_TYPES: Record<TransactionType, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
};
