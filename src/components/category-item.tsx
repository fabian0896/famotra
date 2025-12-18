import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Spinner } from './ui/spinner';
import { CreateEditCategoryDialog } from './create-edit-category';
import type React from 'react';
import type { Category } from '@/models/categories.models';
import { Categories } from '@/services/categories';
import { categoriesQueryOptions } from '@/query-options/categories';

function DeleteCategoryDialog({
  category,
  children,
  onConfirm,
}: {
  category: Category;
  children: React.ReactNode;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar Categoría {category.name}</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que deseas eliminar la categoría{' '}
            <span className="text-foreground font-semibold">{category.name}</span>? Esta acción
            también eliminará todas las transacciones asociadas a esta categoría
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Eliminar categoría
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CategoryList({
  children,
  title,
  description,
  ...props
}: { title: string; description: string } & React.ComponentProps<'div'>) {
  const [parent] = useAutoAnimate();
  return (
    <div {...props}>
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul ref={parent} className="flex gap-8 flex-wrap">
        {children}
      </ul>
    </div>
  );
}

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
    <li>
      <CreateEditCategoryDialog isOpen={editOpen} onOpenChange={setEditOpen} category={category} />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button className="flex flex-col justify-center items-center gap-1.5 group">
            <div className="bg-primary-foreground rounded-full w-16 h-16 text-2xl flex items-center justify-center">
              <span className="group-hover:scale-110 group-hover:rotate-12 transition-all">
                {category.icon}
              </span>
            </div>
            <span className="text-muted-foreground text-center font-medium text-sm lowercase first-letter:capitalize group-hover:text-foreground">
              {category.name}
            </span>
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="flex flex-col justify-center items-center">
            <div className="w-22 h-22 rounded-full bg-primary-foreground flex items-center justify-center text-4xl border border-primary">
              {category.icon}
            </div>
            <SheetTitle className="text-4xl font-semibold mt-1">{category.name}</SheetTitle>
            <SheetDescription>
              <Badge>
                <ArrowUpLeft />
                {category.transaction_type}
              </Badge>
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
