import { nanoid } from 'nanoid';
import type { InsertToken } from '../models/tokens.model';
import { supabase } from '@/integrations/supabase/client';

export class TokenService {
  static async get() {
    const { data } = await supabase
      .from('api_tokens')
      .select()
      .order('created_at', { ascending: true })
      .throwOnError();
    return data;
  }

  static async create(data: Omit<InsertToken, 'id'>) {
    const id = `fmt_${nanoid(32)}`;
    const { data: result } = await supabase
      .from('api_tokens')
      .insert({ ...data, id })
      .select()
      .single()
      .throwOnError();
    return result;
  }

  static async remove({ id }: { id: string }) {
    const { data } = await supabase
      .from('api_tokens')
      .delete()
      .eq('id', id)
      .select()
      .single()
      .throwOnError();
    return data;
  }
}
