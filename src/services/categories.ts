import type { CategoryDelete, CategoryInsert } from '@/models/categories.models';
import { supabase } from '@/integrations/supabase/client';

export class Categories {
  static async get() {
    const { data } = await supabase.from('categories').select().throwOnError();
    return data;
  }

  static async create(data: CategoryInsert) {
    const { data: category } = await supabase.from('categories').insert(data).throwOnError();
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
