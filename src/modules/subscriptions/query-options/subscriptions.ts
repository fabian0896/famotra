import { infiniteQueryOptions } from '@tanstack/react-query';
import { Subscriptions } from '../services/subscriptions';
import { QueryKeys } from '@/constants/query-keys';

export const subscriptionsQueryOptions = infiniteQueryOptions({
  queryKey: [QueryKeys.SUBSCRIPTIONS],
  queryFn: ({ pageParam }) => Subscriptions.get({ page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, _pages, lastPageParam) => {
    if (!lastPage.length) return undefined;
    return lastPageParam + 1;
  },
  select: (data) => data.pages.flat(),
});
