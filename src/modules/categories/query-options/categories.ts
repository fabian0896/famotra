import { queryOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type {
  CategoryResume,
  CategoryTypes,
  CategoryWithBudget,
} from '../models/categories.models';
import type { DateRange } from '@/lib/date-utils';
import { QueryKeys } from '@/constants/query-keys';
import { Categories } from '@/modules/categories/services/categories';

export const categoriesQueryOptions = queryOptions({
  queryKey: [QueryKeys.CATEGORIES],
  queryFn: () => Categories.get(),
  staleTime: Infinity,
});

const resumeToCategory = (resume: CategoryResume): CategoryWithBudget => ({
  id: resume.category_id,
  name: resume.category_name,
  color: resume.category_color,
  icon: resume.category_icon,
  type: resume.category_type,
  user_id: null,
  created_at: '',
  budget: null,
});

export const categoryByIdOption = ({
  id,
  queryClient,
}: {
  id: string;
  queryClient?: QueryClient;
}) => {
  return queryOptions({
    queryKey: [QueryKeys.CATEGORIES, { id }],
    queryFn: () => Categories.getById(id),
    staleTime: Infinity,
    initialData: () => {
      if (!queryClient) return undefined;
      const allResumeEntries = queryClient.getQueriesData<CategoryResume[]>({
        queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.CATEGORIES, QueryKeys.CATEGORIES_RESUME],
      });
      for (const [, data] of allResumeEntries) {
        const found = data?.find((c) => c.category_id === id);
        if (found) return resumeToCategory(found);
      }
      return undefined;
    },
    initialDataUpdatedAt: () => {
      if (!queryClient) return undefined;
      const states = queryClient.getQueriesData<CategoryResume[]>({
        queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.CATEGORIES, QueryKeys.CATEGORIES_RESUME],
      });
      return (
        states
          .map(([key]) => queryClient.getQueryState(key)?.dataUpdatedAt ?? 0)
          .reduce((oldest, t) => Math.min(oldest, t), Infinity) || undefined
      );
    },
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
