import type { DateRange } from '@/hooks/use-date-range';
import { supabase } from '@/integrations/supabase/client';

export class HomeService {
  static async getResume({ start, end }: DateRange) {
    const { data } = await supabase
      .rpc('get_balance_summary', {
        p_date_from: start,
        p_date_to: end,
      })
      .single()
      .throwOnError();
    return data;
  }
}
