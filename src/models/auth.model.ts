import type { User as U } from '@supabase/supabase-js';

export interface LoginOptions {
  email: string;
  password: string;
}

export interface SignUpOptions {
  email: string;
  password: string;
  name: string;
}

export interface User extends U {
  user_metadata: { name: string };
}
