import type { Tables } from '@/models/database.types.ts';

export interface Bindings {
  NOTION_API_KEY: string;
  CLARO_API_KEY: string;
}

export interface Variables {
  userId: string;
  token: Tables<'api_tokens'>;
}

export interface HonoEnv {
  Bindings: Bindings;
  Variables: Variables;
}
