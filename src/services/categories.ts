import type { CategoryDelete, CategoryInsert } from '@/models/categories.models';
import { supabase } from '@/integrations/supabase/client';

export class Categories {
  static async get() {
    const incomesPromise = supabase
      .from('categories')
      .select()
      .eq('transaction_type', 'income')
      .throwOnError();
    const expensesPromise = supabase
      .from('categories')
      .select()
      .eq('transaction_type', 'expense')
      .throwOnError();
    const [{ data: incomes }, { data: expenses }] = await Promise.all([
      incomesPromise,
      expensesPromise,
    ]);
    return { incomes, expenses };
  }

  static async search(search: string) {
    const { data: categories } = await supabase
      .from('categories')
      .select()
      .ilike('name', `%${search}%`)
      .throwOnError();
    return categories;
  }

  static async getById(categoryId: string) {
    const { data: category } = await supabase
      .from('categories')
      .select()
      .eq('id', categoryId)
      .single()
      .throwOnError();
    return category;
  }

  static async create(data: CategoryInsert) {
    const { data: category } = await supabase.from('categories').insert(data).throwOnError();
    return category;
  }

  static async upsert(data: CategoryInsert) {
    const { data: category } = await supabase.from('categories').upsert(data).throwOnError();
    return category;
  }

  static async remove(data: CategoryDelete) {
    const { data: category } = await supabase
      .from('categories')
      .delete()
      .eq('id', data.id)
      .single()
      .throwOnError();
    return category;
  }
}
