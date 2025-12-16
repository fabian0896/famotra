import type { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Account = Tables<'accounts'>;
export type AccountInsert = TablesInsert<'accounts'>;
export type AccountUpdate = TablesUpdate<'accounts'>;
export type AccountDelete = { id: string };
