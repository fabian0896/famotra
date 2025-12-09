import { queryOptions } from '@tanstack/react-query';
import { Auth } from '@/services/auth';
import { QueryKeys } from '@/constants/query-keys';

export const authQueryOptions = queryOptions({
  queryKey: [QueryKeys.AUTH_STATE],
  queryFn: () => Auth.getUser(),
  staleTime: Infinity,
  refetchOnWindowFocus: true,
});
