import type { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Account = Tables<'accounts'> & { bank: { name: string; logo: string } | null };
export type AccountInsert = TablesInsert<'accounts'>;
export type AccountUpdate = TablesUpdate<'accounts'>;
export type AccountDelete = { id: string };
