import { useSuspenseQuery } from '@tanstack/react-query';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { Suspense } from 'react';
import { categoryByIdOption } from '../query-options/categories';
import { CategoryTransactions } from '../components/category-transactions';
import { CategoryDetailsCard } from '../components/category-details-card';
import { Content, Header } from '@/components/dashboard-layout';
import { getDateRange, useMonthYear } from '@/hooks/use-date-range';

export function CategoryDetails({ id }: { id: string }) {
  const { start = getDateRange().start, end = getDateRange().end } = useSearch({
    from: '/dashboard/categories/$id',
  });
  const { month, year } = useMonthYear({ start, end });
  const { data: category } = useSuspenseQuery(categoryByIdOption({ id }));
  return (
    <>
      <Header>
        <Header.BackButton />
        <Header.Title>{category.name}</Header.Title>
        <Header.Actions>
          <Header.ActionButton size="sm">
            <Edit2Icon />
          </Header.ActionButton>
          <Header.ActionButton size="sm" variant="destructive">
            <Trash2Icon />
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content>
        <Suspense fallback={<p>Cargando...</p>}>
          <CategoryDetailsCard categoryId={id} month={month} year={year} range={{ start, end }} />
        </Suspense>
        <div className="mt-5">
          <Suspense fallback={<p>Cargando...</p>}>
            <CategoryTransactions range={{ start, end }} categoryId={id} />
          </Suspense>
        </div>
      </Content>
    </>
  );
}
