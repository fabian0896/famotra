import { supabase } from '@/integrations/supabase/client';

export class Subscriptions {
  static async get() {
    const { data: subscriptions } = await supabase.from('subscriptions').select().throwOnError();
    return { subscriptions };
  }

  static async create() {}

  static async upsert() {}
  static async remove() {}
}
