import { queryOptions } from '@tanstack/react-query';
import type { CategoryTypes } from '../models/categories.models';
import type { DateRange } from '@/hooks/use-date-range';
import { QueryKeys } from '@/constants/query-keys';
import { Categories } from '@/modules/categories/services/categories';

export const categoriesQueryOptions = queryOptions({
  queryKey: [QueryKeys.CATEGORIES],
  queryFn: () => Categories.get(),
  staleTime: Infinity,
});

export const categoryByIdOption = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: [QueryKeys.CATEGORIES, { id }],
    queryFn: () => Categories.getById(id),
    staleTime: Infinity,
  });
};

export const categoryResumeQueryOptions = (options: { type: CategoryTypes; range: DateRange }) => {
  return queryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.CATEGORIES, QueryKeys.CATEGORIES_RESUME, options],
    queryFn: () => Categories.categoryResume(options),
    staleTime: Infinity,
  });
};

export const categoryDetailsOptions = ({ id, range }: { id: string; range: DateRange }) => {
  return queryOptions({
    queryKey: [
      QueryKeys.TRANSACTIONS,
      QueryKeys.CATEGORIES,
      QueryKeys.CATEGORIES_DETAILS,
      { id, range },
    ],
    queryFn: () => Categories.categoryDetails({ id, range }),
    staleTime: Infinity,
  });
};
