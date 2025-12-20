import type { Enums, Tables, TablesInsert, TablesUpdate } from './database.types';

export type Category = Tables<'categories'>;

export type CategoryInsert = TablesInsert<'categories'>;

export type CategoryUpdate = TablesUpdate<'categories'>;

export type CategoryDelete = { id: string };

export type CategoryTypes = Enums<'category_type'>;
export const CATEGORY_TYPES: Record<CategoryTypes, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
};
