import { formatISO, isSameMonth, parseISO } from 'date-fns';
import type { DateRange } from '@/hooks/use-date-range';
import type {
  Category,
  CategoryDelete,
  CategoryInsert,
  CategoryTypes,
} from '../models/categories.models';
import { supabase } from '@/integrations/supabase/client';

export class Categories {
  static async get(): Promise<Record<CategoryTypes, Category[]>> {
    const incomesPromise = supabase.from('categories').select().eq('type', 'income').throwOnError();
    const expensesPromise = supabase
      .from('categories')
      .select()
      .eq('type', 'expense')
      .throwOnError();
    const [{ data: income }, { data: expense }] = await Promise.all([
      incomesPromise,
      expensesPromise,
    ]);
    return { income, expense };
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

  static async categoryResume({
    type = 'expense',
    range,
  }: {
    type: CategoryTypes;
    range: DateRange;
  }) {
    const { data } = await supabase
      .rpc('get_categories_resume', {
        p_type: type,
        p_start_date: range.start,
        p_end_date: range.end,
      })
      .throwOnError();
    return data;
  }

  static async categoryDetails({ id, range }: { id: string; range: DateRange }) {
    const p_start_date = range.start;
    let p_end_date = range.end;

    const isCurrentMonth = isSameMonth(parseISO(range.start), new Date());
    if (isCurrentMonth) {
      p_end_date = formatISO(new Date(), { representation: 'date' });
    }

    const { data } = await supabase
      .rpc('get_category_detail', {
        p_category_id: id,
        p_start_date: p_start_date,
        p_end_date: p_end_date,
      })
      .throwOnError();
    return data[0];
  }
}
