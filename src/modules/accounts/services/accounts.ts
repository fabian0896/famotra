import type { AccountDelete, AccountInsert } from '../models/accounts.models';
import { supabase } from '@/integrations/supabase/client';

export class Accounts {
  static async get() {
    const { data: accounts } = await supabase
      .from('accounts')
      .select('*, bank:bank_list(id,name,logo)')
      .order('balance', { ascending: false })
      .throwOnError();
    const total = accounts.reduce((t, a) => t + a.balance, 0);
    return { accounts, total };
  }

  static async getNetWorthSummary() {
    const { data } = await supabase.rpc('get_net_worth_summary').throwOnError();
    const raw = data[0];
    const netWorthAtStart = raw.current_net_worth - raw.monthly_change;
    const monthly_change_pct =
      netWorthAtStart !== 0 ? Math.round((raw.monthly_change / netWorthAtStart) * 1000) / 10 : 0;
    return { current_net_worth: raw.current_net_worth, monthly_change_pct };
  }

  static async getById(id: string) {
    const { data } = await supabase
      .from('accounts')
      .select('*, bank:bank_list(id,name,logo)')
      .eq('id', id)
      .single()
      .throwOnError();
    return data;
  }

  static async create(data: AccountInsert) {
    const { data: account } = await supabase.from('accounts').insert(data).throwOnError();
    return account;
  }

  static async upsert(data: AccountInsert) {
    data.bank_id ||= undefined;
    const { data: account } = await supabase.from('accounts').upsert(data).throwOnError();
    return account;
  }

  static async remove(data: AccountDelete) {
    const { data: account } = await supabase
      .from('accounts')
      .delete()
      .eq('id', data.id)
      .single()
      .throwOnError();
    return account;
  }
}
