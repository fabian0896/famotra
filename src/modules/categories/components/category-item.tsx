import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CATEGORY_TYPES } from '../models/categories.models';
import { CreateEditCategoryDialog } from './create-edit-category';
import { DeleteCategoryDialog } from './delete-category-dialog';
import type { Category } from '../models/categories.models';
import { Categories } from '@/modules/categories/services/categories';
import { categoriesQueryOptions } from '@/modules/categories/query-options/categories';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

export function CategoryItem({ category }: { category: Category }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
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
      setSheetOpen(false);
    },
  });

  const handleOpenEdit = () => {
    setSheetOpen(false);
    setEditOpen(true);
  };

  return (
    <li className="block h-full w-full">
      <CreateEditCategoryDialog isOpen={editOpen} onOpenChange={setEditOpen} category={category} />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button className="w-full h-full group grow border border-border bg-card rounded-xl p-4 transition-all hover:border-primary hover:bg-primary/10">
            <div className="bg-primary/20 rounded-full w-16 h-16 text-2xl flex items-center justify-center mx-auto mb-4">
              <span className="group-hover:scale-110 group-hover:rotate-12 transition-all">
                {category.icon}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p
                title={category.name}
                className="text-foreground text-center font-medium text-base lowercase first-letter:capitalize group-hover:text-foreground line-clamp-1 mb-0.5"
              >
                {category.name}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 text-center">
                <span className="h-1.5 w-1.5 bg-green-600 rounded-full"></span>
                Activa
              </p>
            </div>
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="flex flex-col justify-center items-center">
            <div className="w-22 h-22 rounded-full bg-primary-foreground flex items-center justify-center text-4xl border border-primary">
              {category.icon}
            </div>
            <SheetTitle className="text-4xl font-semibold mt-1 text-center">
              {category.name}
            </SheetTitle>
            <SheetDescription>
              <Badge>{CATEGORY_TYPES[category.type]}</Badge>
            </SheetDescription>
          </SheetHeader>
          <div className="flex gap-4 px-4">
            <Button onClick={handleOpenEdit} className="flex-1" variant="outline">
              Editar
            </Button>
            <DeleteCategoryDialog
              onConfirm={() => remove.mutate({ id: category.id })}
              category={category}
            >
              <Button disabled={remove.isPending} className="flex-1" variant="destructive">
                {remove.isPending ? <Spinner /> : <Trash2 />}
                Eliminar
              </Button>
            </DeleteCategoryDialog>
          </div>
          <Separator className="my-2" />
          <div className="px-4">
            <h6 className="font-medium text-foreground text-sm">Transacciones recientes</h6>
          </div>
        </SheetContent>
      </Sheet>
    </li>
  );
}
