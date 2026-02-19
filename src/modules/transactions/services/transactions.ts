import type { TransactionTypes, TransactionsInsert } from '../models/transactions.models';
import type { TransactionFilters } from '../models/transaction-filters';
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

  static async upsert(data: TransactionsInsert) {
    data.amount = Transactions.formatAmount(data.amount, data.transaction_type);
    const { data: transaction } = await supabase
      .from('transactions')
      .upsert(data)
      .select()
      .single()
      .throwOnError();
    return transaction;
  }

  static async get({
    page = 1,
    pageSize = 25,
    filters,
  }: {
    page?: number;
    pageSize?: number;
    filters?: TransactionFilters;
  }) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase.from('transactions').select(
      `
        *,
        category:categories (id, name, icon),
        account:accounts!account_id (
          id,
          name,
          custom_bank_name,
          custom_bank_icon,
          bank:bank_list (id, logo, name)
        ),
        destination:accounts!destination_account_id (
          id,
          name,
          custom_bank_name,
          custom_bank_icon,
          bank:bank_list (id, logo, name)
        ),
        card:shorcut_cards!card_id (name)
        `
    );

    if (filters?.from) {
      query = query.gte('date', filters.from);
    }
    if (filters?.to) {
      query = query.lte('date', filters.to);
    }
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.accountId) {
      query = query.or(
        `account_id.eq.${filters.accountId},destination_account_id.eq.${filters.accountId}`
      );
    }
    if (filters?.transactionType) {
      query = query.eq('transaction_type', filters.transactionType);
    }

    const { data: transactions } = await query
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)
      .throwOnError();
    return transactions;
  }

  static async remove({ id }: { id: string }) {
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
    if (type === 'income') return value;
    return value * -1;
  }
}
