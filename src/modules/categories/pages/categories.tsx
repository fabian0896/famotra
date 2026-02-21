import { Suspense, useState } from 'react';
import { CategoryList, CategoryListSkeleton } from '../components/category-list';
import type { CategoryTypes } from '../models/categories.models';
import type { DateRange } from '@/hooks/use-date-range';
import { Content, Header } from '@/components/dashboard-layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateSelector } from '@/components/date-selector';
import { getDateRange } from '@/hooks/use-date-range';

export function CategoriesPage() {
  const [date, setDate] = useState(() => new Date());
  const [rangeDate, setRangeDate] = useState<DateRange>(() => getDateRange());
  const [type, setType] = useState<CategoryTypes>('expense');

  return (
    <>
      <Header title="Categorías"></Header>

      <Content>
        <DateSelector
          className="mb-4"
          value={date}
          onValueChange={({ value, range }) => {
            setDate(value);
            setRangeDate(range);
          }}
        />

        <Tabs value={type} onValueChange={(value) => setType(value as CategoryTypes)}>
          <TabsList className="mt-2 mb-4">
            <TabsTrigger value="expense">Gastos</TabsTrigger>
            <TabsTrigger value="income">Ingresos</TabsTrigger>
          </TabsList>
        </Tabs>

        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList range={rangeDate} type={type} />
        </Suspense>
      </Content>
    </>
  );
}
