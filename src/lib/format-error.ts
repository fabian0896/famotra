import { AuthError, PostgrestError } from '@supabase/supabase-js';

export function formatError(error: unknown) {
  if (error instanceof PostgrestError) {
    return { message: error.message };
  }
  if (error instanceof AuthError) {
    return { message: error.message };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Algo salió mal. Por favor intenta nuevamente' };
}
