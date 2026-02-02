import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { FormattedMoney } from './formatted-money';
import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cagoryResumeQueryOptions } from '@/modules/categories/query-options/categories';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CategoryResume({ ...props }: React.ComponentProps<typeof Card>) {
  const { data } = useSuspenseQuery(cagoryResumeQueryOptions());
  return (
    <Card {...props}>
      <CardContent>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon">
            <ChevronLeftIcon />
          </Button>
          <h6 className="text-base font-semibold text-foreground flex-1 text-center">
            Febrero 2026
          </h6>
          <Button variant="outline" size="icon">
            <ChevronRightIcon />
          </Button>
        </div>
        <Tabs defaultValue="expense">
          <TabsList className="w-full">
            <TabsTrigger value="expense">Gastos</TabsTrigger>
            <TabsTrigger value="income">Ingresos</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="space-y-8 mt-8">
          {data.map((category) => (
            <div key={category.category_id}>
              <div className="flex justify-between mb-3">
                <div className="flex gap-2 items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/30 flex items-center justify-center text-sm">
                    {category.category_icon}
                  </div>
                  <div>
                    <p className="text-sm text-foreground mb-0.5">{category.category_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.transaction_count}{' '}
                      {category.transaction_count === 1 ? 'transaccion' : 'transacciones'}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-foreground font-medium text-right mb-0.5">
                    <FormattedMoney value={category.total_amount} />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {category.percentage}%
                  </div>
                </div>
              </div>
              <Progress value={category.percentage} className="w-full" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center pt-8">
          <Link
            className="text-primary text-sm font-medium hover:underline"
            to="/dashboard/categories"
          >
            Ver todas las categorías
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
