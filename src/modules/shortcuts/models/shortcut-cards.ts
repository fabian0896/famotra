import type { Tables, TablesUpdate } from '@/models/database.types';

export type ShortcutCard = Tables<'shorcut_cards'> & {
  token_data: { name: string; id: string };
};

export type ShortcutCardUpdate = TablesUpdate<'shorcut_cards'>;
