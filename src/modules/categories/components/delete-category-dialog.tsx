import type { Category } from '../models/categories.models';
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
} from '@/components/ui/alert-dialog';

export function DeleteCategoryDialog({
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
