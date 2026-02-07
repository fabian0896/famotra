import type { UserListOptions, UserRole } from '../models/users.models';
import { supabase } from '@/integrations/supabase/client';

export class UsersService {
  static async list({ search = '', page = 1, pageSize = 10 }: UserListOptions = {}) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .neq('id', user?.id ?? '');

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)
      .throwOnError();

    return { users, total: count ?? 0 };
  }

  static async updateRole({ id, role }: { id: string; role: UserRole }) {
    const { data } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single()
      .throwOnError();
    return data;
  }
}
