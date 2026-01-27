import type { Tables, TablesInsert, TablesUpdate } from '@/models/database.types';

export type Subscription = Tables<'subscriptions'>;
export type SubscriptionInsert = TablesInsert<'subscriptions'>;
export type SubscriptionUpsert = TablesUpdate<'subscriptions'>;
export type SubscriptionDelete = { id: string };
export type SubscriptionTypes = Tables<'subscriptions'>['subscription_type'];
