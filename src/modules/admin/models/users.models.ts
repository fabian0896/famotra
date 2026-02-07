import type { Enums, Tables, TablesUpdate } from '@/models/database.types';

export type UserProfile = Tables<'user_profiles'>;

export type UpdateUserDTO = TablesUpdate<'user_profiles'>;

export type UserRole = Enums<'user_role'>;

export type UserListOptions = {
  search?: string;
  page?: number;
  pageSize?: number;
};
