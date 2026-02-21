import type { CategoryResume } from '../models/categories.models';
import { FormattedMoney } from '@/components/formatted-money';

export function CategoryItem({ category }: { category: CategoryResume }) {
  return (
    <li className="block h-full">
      <button className="p-3.5 h-[76px] bg-card w-full rounded-2xl flex gap-3.5 items-center">
        <div className="size-11 rounded-xl bg-primary/15 grid place-items-center text-base">
          {category.category_icon}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between">
            <p className="text-sm text-foreground font-semibold">{category.category_name}</p>
            <p className="text-sm text-foreground font-bold text-right">
              <FormattedMoney allowNegative={false} value={category.total_amount} />
            </p>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div style={{ width: `${category.percentage}%` }} className="h-full bg-primary"></div>
          </div>
        </div>
      </button>
    </li>
  );
}
