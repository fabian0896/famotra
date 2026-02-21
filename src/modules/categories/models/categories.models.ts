import type { Database, Enums, Tables, TablesInsert, TablesUpdate } from '@/models/database.types';

export type Category = Tables<'categories'>;

export type CategoryInsert = TablesInsert<'categories'>;

export type CategoryUpdate = TablesUpdate<'categories'>;

export type CategoryDelete = { id: string };

export type CategoryTypes = Enums<'category_type'>;
export const CATEGORY_TYPES: Record<CategoryTypes, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
};

export type CategoryResume =
  Database['public']['Functions']['get_categories_resume']['Returns'][number];

export type CategoryDetails =
  Database['public']['Functions']['get_category_detail']['Returns'][number];
