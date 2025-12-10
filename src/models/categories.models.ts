import type { Enums, Tables, TablesInsert } from './database.types';

export type Category = Tables<'categories'>;
export type CategoryInsert = TablesInsert<'categories'>;
export type TransactionType = Enums<'transaction_type'>;
