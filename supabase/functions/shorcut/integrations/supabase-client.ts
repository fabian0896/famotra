import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/models/database.types.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
