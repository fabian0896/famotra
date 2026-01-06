import { queryOptions } from '@tanstack/react-query';
import { TokenService } from '../services/tokens';
import { QueryKeys } from '@/constants/query-keys';

export const tokensQueryOptions = queryOptions({
  queryKey: [QueryKeys.TOKENS],
  queryFn: TokenService.get,
  staleTime: Infinity,
});
