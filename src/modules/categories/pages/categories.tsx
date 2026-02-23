import { Suspense } from 'react';
import { PlusIcon } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { CategoryList, CategoryListSkeleton } from '../components/category-list';
import type { CategoryTypes } from '../models/categories.models';
import type { DateRange } from '@/lib/date-utils';
import { getDateRange } from '@/lib/date-utils';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateSelector } from '@/components/date-selector';

export function CategoriesPage() {
  const navigate = useNavigate();
  const {
    type = 'expense',
    start = getDateRange().start,
    end = getDateRange().end,
  } = useSearch({ from: '/dashboard/categories/' });

  const range = { start, end };

  const handleChangeType = (t: CategoryTypes) => {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, type: t }),
      replace: true,
    });
  };

  const handleChangeRange = (event: { range: DateRange }) => {
    navigate({
      to: '.',
      replace: true,
      search: (prev) => ({ ...prev, ...event.range }),
    });
  };

  return (
    <Page>
      <Header>
        <Header.Title>Categorías</Header.Title>
        <Header.Actions>
          <Header.ActionButton asChild>
            <Link to="/dashboard/categories/new">
              <PlusIcon />
            </Link>
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content>
        <DateSelector className="mb-4" value={range} onValueChange={handleChangeRange} />

        <Tabs value={type} onValueChange={(value) => handleChangeType(value as CategoryTypes)}>
          <TabsList className="mt-2 mb-4">
            <TabsTrigger value="expense">Gastos</TabsTrigger>
            <TabsTrigger value="income">Ingresos</TabsTrigger>
          </TabsList>
        </Tabs>

        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList range={{ start, end }} type={type} />
        </Suspense>
      </Content>
    </Page>
  );
}
