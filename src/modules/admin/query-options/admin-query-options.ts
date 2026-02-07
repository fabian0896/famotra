import { queryOptions } from '@tanstack/react-query';
import { UsersService } from '../services/users.service';
import type { UserListOptions } from '../models/users.models';
import { QueryKeys } from '@/constants/query-keys';

export const usersQueryOptions = ({ search = '', page = 1, pageSize = 10 }: UserListOptions = {}) =>
  queryOptions({
    queryKey: [QueryKeys.USERS_LIST, { search, page, pageSize }] as const,
    queryFn: ({ queryKey: { 1: options } }) => UsersService.list(options),
    staleTime: Infinity,
  });
