import type { Account } from '../models/accounts.models';
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

export function DeleteAccountDialog({
  account,
  children,
  onConfirm,
}: {
  account: Account;
  children: React.ReactNode;
  onConfirm?: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar cuenta {account.name}</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que deseas eliminar la cuenta{' '}
            <span className="text-foreground font-semibold">{account.name}</span>? Esta acción
            también eliminará todas las transacciones asociadas a esta cuenta
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Eliminar cuenta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
