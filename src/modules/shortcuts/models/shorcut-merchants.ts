import type { Tables, TablesUpdate } from '@/models/database.types';

export type ShortcutMerchant = Tables<'shorcuts_merchants'> & {
  token_data: { name: string; id: string };
};

export type ShortcutMerchantUpdate = TablesUpdate<'shorcuts_merchants'>;
