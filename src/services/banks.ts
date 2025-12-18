import { supabase } from '@/integrations/supabase/client';

export class Banks {
  static async getBankList() {
    const { data } = await supabase.from('bank_list').select().throwOnError();
    return data;
  }
}
