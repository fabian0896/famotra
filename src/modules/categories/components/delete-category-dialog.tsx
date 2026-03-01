import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo } from 'sileo';
import { Categories } from '../services/categories';
import { categoriesQueryOptions } from '../query-options/categories';
import type { CategoryResume } from '../models/categories.models';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { QueryKeys } from '@/constants/query-keys';
import { Spinner } from '@/components/ui/spinner';

function updateQueryData({ id }: { id: string }) {
  return (data: CategoryResume[] | undefined) => {
    if (!data) return data;
    const idx = data.findIndex((c) => c.category_id === id);
    if (idx === -1) return data;
    const copy = [...data];
    return copy.toSpliced(idx, 1);
  };
}

export function DeleteCategoryDialog({
  categoryName,
  categoryId,
  children,
  onDeleted,
}: {
  categoryName: string;
  categoryId: string;
  children: React.ReactNode;
  onDeleted?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Categories.remove,
    onSuccess: (_resutl, { id }) => {
      queryClient.setQueriesData<CategoryResume[]>(
        { queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.CATEGORIES, QueryKeys.CATEGORIES_RESUME] },
        updateQueryData({ id })
      );
      onDeleted?.();
      sileo.info({ title: 'Categoría eliminada correctamente' });
      setIsOpen(false);
    },
    onError: () => {
      sileo.error({ title: 'Algo salió mal, por favor intenta nuevamente' });
    },
    onSettled: async (_data, _error, { id }) => {
      queryClient.removeQueries({ queryKey: [QueryKeys.CATEGORIES, { id }] });
      queryClient.invalidateQueries({ queryKey: categoriesQueryOptions.queryKey });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-500/15">
            <Trash2Icon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar {categoryName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es permanente y eliminará todas las transacciones asociadas a{' '}
            <span className="text-foreground font-semibold">{categoryName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => remove.mutate({ id: categoryId })}
            variant="destructive"
          >
            {remove.isPending ? <Spinner /> : <Trash2Icon />}
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
