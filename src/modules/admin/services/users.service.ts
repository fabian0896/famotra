import { supabase } from '@/integrations/supabase/client';

export class UsersService {
  static async list() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: users } = await supabase
      .from('user_profiles')
      .select()
      .neq('id', user?.id ?? '')
      .throwOnError();
    return users;
  }
}
