import { useSuspenseQuery } from '@tanstack/react-query';
import { PlusIcon, TrendingUpIcon } from 'lucide-react';
import { categoryByIdOption } from '../query-options/categories';
import { Content, Header } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';

function Budget({ budget, color }: { budget: boolean; color: string }) {
  if (budget) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-medium text-muted-foreground">Budget: $1,500.00</p>
          <p className="text-sm font-semibold text-primary">83% used</p>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            style={{ width: '50%', '--color': color } as React.CSSProperties}
            className="h-full bg-(--color) rounded-full"
          ></div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-medium text-muted-foreground">
        No budget set for this category
      </p>
      <Button
        style={{ '--color': color } as React.CSSProperties}
        className="h-[38px] rounded-[12px] bg-(--color) shadow-none"
      >
        <PlusIcon />
        Set Budget
      </Button>
    </div>
  );
}

export function CategoryDetails({ id }: { id: string }) {
  const { data: category } = useSuspenseQuery(categoryByIdOption({ id }));

  return (
    <>
      <Header title={category.name} />

      <Content>
        <div className="bg-card p-5 rounded-3xl flex flex-col gap-4">
          <div
            style={{ '--color': category.color } as React.CSSProperties}
            data-color={category.color}
            className="size-16 mx-auto rounded-[20px] bg-(--color)/20 grid place-items-center text-2xl"
          >
            {category.icon}
          </div>
          <h2 className="text-4xl font-bold text-foreground text-center">$1,245.00</h2>
          {category.type === 'income' ? (
            <div className="text-green-400 text-sm font-semibold text-center flex items-center justify-center gap-1.5">
              <TrendingUpIcon className="size-3.5 stroke-3" />
              <span>+12% vs last month</span>
            </div>
          ) : (
            <Budget color={category.color} budget={true} />
          )}
          <p className="text-sm font-medium text-muted-foreground text-center">February 2026</p>
        </div>
      </Content>
    </>
  );
}
