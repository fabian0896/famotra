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

  static async create(data: AccountInsert) {
    const { data: account } = await supabase.from('accounts').insert(data).throwOnError();
    return account;
  }

  static async upsert(data: AccountInsert) {
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
