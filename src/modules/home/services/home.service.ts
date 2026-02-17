import { supabase } from '@/integrations/supabase/client';

export class HomeService {
  static async getResume({ from, to }: { from: Date; to: Date }) {
    const { data } = await supabase
      .rpc('get_balance_summary', {
        p_date_from: from.toISOString(),
        p_date_to: to.toISOString(),
      })
      .single()
      .throwOnError();
    return data;
  }
}
