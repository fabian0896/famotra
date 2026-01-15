import type { Tables, TablesInsert, TablesUpdate } from '@/models/database.types';

export type Subscriptions = Tables<'subscriptions'>;
export type SubscriptionInsert = TablesInsert<'subscriptions'>;
export type SubscriptionUpsert = TablesUpdate<'subscriptions'>;
export type SubscriptionDelete = { id: string };
