import type { ShortcutMerchant } from '../models/shorcut-merchants';
import { supabase } from '@/integrations/supabase/client';

export class ShortcutsMerchantService {
  static async get() {
    const { data } = await supabase
      .from('shorcuts_merchants')
      .select(`*, token_data:api_tokens (id, name)`)
      .order('last_used_at')
      .throwOnError();
    return data;
  }

  static async update(data: ShortcutMerchant) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_data: _, ...value } = data;
    const { data: result } = await supabase
      .from('shorcuts_merchants')
      .update(value)
      .eq('token', data.token)
      .eq('name', data.name)
      .select()
      .single()
      .throwOnError();
    return result;
  }
}
