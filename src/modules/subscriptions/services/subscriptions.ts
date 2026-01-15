import type { SubscriptionDelete, SubscriptionInsert } from '../models/subscriptions.models';
import { supabase } from '@/integrations/supabase/client';

export class Subscriptions {
  static async get({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number }) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select()
      .order('created_at', { ascending: false })
      .range(from, to)
      .throwOnError();
    return subscriptions;
  }

  static async create(data: SubscriptionInsert) {
    const { data: subscription } = await supabase.from('subscriptions').insert(data).throwOnError();
    return subscription;
  }

  static async upsert() {}

  static async remove(data: SubscriptionDelete) {
    const { data: account } = await supabase
      .from('accounts')
      .delete()
      .eq('id', data.id)
      .single()
      .throwOnError();
    return account;
  }
}
