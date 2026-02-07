import type { Tables, TablesInsert, TablesUpdate } from '@/models/database.types';

export type Bank = Tables<'bank_list'>;
export type BankInsert = TablesInsert<'bank_list'>;
export type BankUpdate = TablesUpdate<'bank_list'>;
