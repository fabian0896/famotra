import type { Tables, TablesInsert } from '@/models/database.types';

export type Token = Tables<'api_tokens'>;
export type InsertToken = TablesInsert<'api_tokens'>;
