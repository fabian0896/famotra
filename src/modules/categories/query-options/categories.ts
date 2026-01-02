import { queryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Categories } from '@/modules/categories/services/categories';

export const categoriesQueryOptions = queryOptions({
  queryKey: [QueryKeys.CATEGORIES],
  queryFn: () => Categories.get(),
  staleTime: Infinity,
});

export const categorySearchQueryOptions = (search: string) => {
  return queryOptions({
    queryKey: [QueryKeys.CATEGORIES, 'search', search],
    queryFn: () => Categories.search(search),
  });
};

export const cagoryQueryOptions = (categoryId?: string) => {
  return queryOptions({
    queryKey: [QueryKeys.CATEGORIES, categoryId],
    queryFn: () => Categories.getById(categoryId!),
    enabled: !!categoryId,
  });
};
