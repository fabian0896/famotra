import { Link } from '@tanstack/react-router';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { DeleteCategoryDialog } from './delete-category-dialog';
import type { CategoryResume } from '../models/categories.models';
import type { DateRange } from '@/lib/date-utils';
import { FormattedMoney } from '@/components/formatted-money';
import { Swipeable } from '@/components/swipeable';

export function CategoryItem({ category, range }: { category: CategoryResume; range?: DateRange }) {
  return (
    <Swipeable>
      <Swipeable.Item>
        <li className="block h-full group">
          <Link
            to="/dashboard/categories/$id"
            params={{ id: category.category_id }}
            search={{ start: range?.start, end: range?.end }}
            className="p-3.5 h-[76px] bg-card w-full rounded-2xl flex gap-3.5 items-center group-data-[dragging=true]:rounded-r-none"
          >
            <div
              style={{ '--color': category.category_color } as React.CSSProperties}
              className="size-11 rounded-xl bg-(--color)/15 grid place-items-center text-base"
            >
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
                <div
                  style={
                    {
                      width: `${category.percentage}%`,
                      '--color': category.category_color,
                    } as React.CSSProperties
                  }
                  className="h-full bg-(--color) rounded-full"
                ></div>
              </div>
            </div>
          </Link>
        </li>
      </Swipeable.Item>
      <Swipeable.Actions>
        <Swipeable.Action asChild>
          <Link
            to="/dashboard/categories/$id/edit"
            params={{ id: category.category_id }}
            className="bg-primary text-primary-foreground"
          >
            <PencilIcon className="size-5 mb-1" />
            <p className="text-[10px] font-semibold">Editar</p>
          </Link>
        </Swipeable.Action>
        <DeleteCategoryDialog
          categoryName={category.category_name}
          categoryId={category.category_id}
        >
          <Swipeable.Action className="bg-red-400 text-red-50 rounded-r-2xl">
            <Trash2Icon className="size-5 mb-1" />
            <p className="text-[10px] font-semibold">Eliminar</p>
          </Swipeable.Action>
        </DeleteCategoryDialog>
      </Swipeable.Actions>
    </Swipeable>
  );
}
