import { queryOptions } from '@tanstack/react-query';
import { UsersService } from '../services/users.service';
import { QueryKeys } from '@/constants/query-keys';

export const usersQueryOptions = queryOptions({
  queryKey: [QueryKeys.USERS_LIST],
  queryFn: () => UsersService.list(),
  staleTime: Infinity,
});
