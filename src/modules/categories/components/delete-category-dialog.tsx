import { Trash2Icon } from 'lucide-react';
import type { Category } from '../models/categories.models';
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
          <AlertDialogMedia className="bg-red-500/15">
            <Trash2Icon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar {category.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es permanente y eliminará todas las transacciones asociadas a{' '}
            <span className="text-foreground font-semibold">{category.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            <Trash2Icon />
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
