import type { LoginOptions, SignUpOptions } from '@/modules/auth/models/auth.model';
import { supabase } from '@/integrations/supabase/client';

export class Auth {
  static async login(options: LoginOptions) {
    const { data, error } = await supabase.auth.signInWithPassword(options);
    if (error) throw error;
    return data;
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return;
  }

  static async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    const user = data.user;
    const { data: profile } = await supabase
      .from('user_profiles')
      .select()
      .eq('id', user.id)
      .single()
      .throwOnError();
    return { user, profile };
  }

  static async signUp(options: SignUpOptions) {
    const { name, ...credentials } = options;
    const emailRedirectTo = `${location.origin}/dashboard`;
    const data = { name };
    const { data: user, error } = await supabase.auth.signUp({
      ...credentials,
      options: { emailRedirectTo, data },
    });
    if (error) throw error;
    return user;
  }
}
