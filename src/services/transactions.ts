import type { TransactionTypes, TransactionsInsert } from '@/models/transactions.models';
import { supabase } from '@/integrations/supabase/client';

export class Transactions {
  static async create(data: TransactionsInsert) {
    data.amount = Transactions.formatAmount(data.amount, data.transaction_type);
    const { data: transaction } = await supabase
      .from('transactions')
      .insert(data)
      .select()
      .single()
      .throwOnError();
    return transaction;
  }

  static async get() {
    const { data: transactions } = await supabase
      .from('transactions')
      .select(
        `
        *, 
        category:categories (name, icon),
        account:accounts (name, bank:bank_list (id, logo, name))
        `
      )
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .throwOnError();
    return transactions;
  }

  static async remove({ id }: { id: string }) {
    console.log({ id });
    const { data } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .single()
      .throwOnError();
    return data;
  }

  private static formatAmount(amount = 0, type: TransactionTypes = 'expense') {
    const value = Math.abs(amount);
    if (type === 'expense') {
      return value * -1;
    }
    if (type === 'income') {
      return value;
    }
    return value * -1;
  }
}
