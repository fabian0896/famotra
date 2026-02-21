import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Suspense } from 'react';
import { sileo } from 'sileo';
import { categoriesQueryOptions, categoryByIdOption } from '../query-options/categories';
import { CategoryTransactions } from '../components/category-transactions';
import { CategoryDetailsCard } from '../components/category-details-card';
import { DeleteCategoryDialog } from '../components/delete-category-dialog';
import { Categories } from '../services/categories';
import { Content, Header } from '@/components/dashboard-layout';
import { getDateRange, useMonthYear } from '@/hooks/use-date-range';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryKeys } from '@/constants/query-keys';

function CategoryTransactionsSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-5 w-20" />
      </div>
      <ul className="mt-3 space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="p-3.5 py-3 bg-card rounded-xl flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryDetails({ id }: { id: string }) {
  const { start = getDateRange().start, end = getDateRange().end } = useSearch({
    from: '/dashboard/categories/$id',
  });
  const { month, year } = useMonthYear({ start, end });
  const { data: category } = useSuspenseQuery(categoryByIdOption({ id }));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Categories.remove,
    onSuccess: () => {
      sileo.info({ title: 'Categoría eliminada correctamente' });
      navigate({ to: '/dashboard/categories' });
    },
    onError: () => {
      sileo.error({ title: 'Algo salió mal, por favor intenta nuevamente' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
    },
  });

  return (
    <>
      <Header>
        <Header.BackButton />
        <Header.Title>{category.name}</Header.Title>
        <Header.Actions>
          <Header.ActionButton size="sm">
            <Edit2Icon />
          </Header.ActionButton>
          <DeleteCategoryDialog category={category} onConfirm={() => remove.mutate({ id })}>
            <Header.ActionButton size="sm" variant="destructive">
              <Trash2Icon />
            </Header.ActionButton>
          </DeleteCategoryDialog>
        </Header.Actions>
      </Header>

      <Content>
        <CategoryDetailsCard categoryId={id} month={month} year={year} range={{ start, end }} />
        <div className="mt-5">
          <Suspense fallback={<CategoryTransactionsSkeleton />}>
            <CategoryTransactions range={{ start, end }} categoryId={id} />
          </Suspense>
        </div>
      </Content>
    </>
  );
}
