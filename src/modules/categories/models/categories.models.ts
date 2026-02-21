import type { Enums, Tables, TablesInsert, TablesUpdate } from '@/models/database.types';

export type Category = Tables<'categories'>;

export type CategoryInsert = TablesInsert<'categories'>;

export type CategoryUpdate = TablesUpdate<'categories'>;

export type CategoryDelete = { id: string };

export type CategoryTypes = Enums<'category_type'>;
export const CATEGORY_TYPES: Record<CategoryTypes, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
};

export type CategoryResume = {
  average_amount: number;
  category_icon: string;
  category_id: string;
  category_name: string;
  category_type: 'income' | 'expense';
  percentage: number;
  total_amount: number;
  transaction_count: number;
};
