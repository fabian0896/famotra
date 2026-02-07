import { queryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Categories } from '@/modules/categories/services/categories';

export const categoriesQueryOptions = queryOptions({
  queryKey: [QueryKeys.CATEGORIES],
  queryFn: () => Categories.get(),
  staleTime: Infinity,
});

export const cagoryResumeQueryOptions = () => {
  return queryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.CATEGORIES_RESUME],
    queryFn: () => Categories.categoryResume(),
    staleTime: Infinity,
  });
};
