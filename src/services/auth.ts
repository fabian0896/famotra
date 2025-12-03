import type { LoginOptions } from "@/models/auth.model";
import { supabase } from "@/integrations/supabase/client";

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
    return data.user;
  }
}