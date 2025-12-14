import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Spinner } from './ui/spinner';
import type React from 'react';
import type { Category } from '@/models/categories.models';
import { cn } from '@/lib/utils';
import { Categories } from '@/services/categories';
import { categoriesQueryOptions } from '@/query-options/categories';

export function CategoryList({ children, className, ...props }: React.ComponentProps<'ul'>) {
  const [parent] = useAutoAnimate();
  return (
    <ul ref={parent} className={cn('flex gap-8 flex-wrap', className)} {...props}>
      {children}
    </ul>
  );
}

export function CategoryItem({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Categories.remove,
    onSuccess: () => {
      toast.info('Se eliminó la categoría correctamente');
    },
    onError: () => {
      toast.error('Algo salió mal por favor intenta nuevamente');
    },
    onSettled: () => {
      const queryKey = categoriesQueryOptions.queryKey;
      queryClient.invalidateQueries({ queryKey });
      setIsOpen(false);
    },
  });
  return (
    <li>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex flex-col gap-1.5">
            <div className="bg-primary-foreground rounded-full w-16 h-16 text-3xl flex items-center justify-center">
              <span>{category.icon}</span>
            </div>
            <span className="text-muted-foreground text-center font-medium text-sm lowercase first-letter:capitalize">
              {category.name}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Edit />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                remove.mutate({ id: category.id });
              }}
              className="text-destructive hover:bg-destructive-foreground"
            >
              {remove.isPending ? (
                <Spinner className="text-destructive" />
              ) : (
                <Trash2 className="text-destructive" />
              )}
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
