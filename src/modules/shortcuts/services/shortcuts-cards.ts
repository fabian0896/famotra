import type { ShortcutCard } from '../models/shortcut-cards';
import { supabase } from '@/integrations/supabase/client';

export class ShortcutsCardService {
  static async get() {
    const { data } = await supabase
      .from('shorcut_cards')
      .select(`*, token_data:api_tokens (id, name)`)
      .order('last_used_at', { ascending: false })
      .throwOnError();
    return data;
  }

  static async update(data: ShortcutCard) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_data: _, ...value } = data;
    const { data: result } = await supabase
      .from('shorcut_cards')
      .update(value)
      .eq('token', data.token)
      .eq('name', data.name)
      .select()
      .single()
      .throwOnError();
    return result;
  }
}
