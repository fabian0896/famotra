import type { AccountDelete, AccountInsert } from '@/models/accounts.models';
import { supabase } from '@/integrations/supabase/client';

export class Accounts {
  static async get() {
    const { data: account } = await supabase
      .from('accounts')
      .select('*, bank:bank_list(id,name,logo)')
      .throwOnError();
    return account;
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

  static async getTotalBalance() {
    const { data } = await supabase.rpc('get_my_total_balance').throwOnError();

    return data;
  }
}
