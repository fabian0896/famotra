import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { sileo } from 'sileo';
import { useState } from 'react';
import { Accounts } from '../services/accounts';
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
import { formatError } from '@/lib/format-error';
import { QueryKeys } from '@/constants/query-keys';
import { Spinner } from '@/components/ui/spinner';

export function DeleteAccountDialog({
  accountId,
  accountName,
  children,
  onRemoved,
}: {
  accountId: string;
  accountName?: string;
  children: React.ReactNode;
  onRemoved?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Accounts.remove,
    onSuccess: () => {
      onRemoved?.();
      sileo.success({ title: 'Cuenta eliminada correctamente' });
      setOpen(false);
    },
    onError: (error) => {
      const { message } = formatError(error);
      sileo.error({ title: 'Error al eliminar', description: message });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: [QueryKeys.ACCOUNTS] });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-500/15">
            <Trash2Icon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar
            {accountName ? (
              <span className="font-semibold text-foreground"> {accountName}</span>
            ) : (
              ' esta cuenta'
            )}
            ? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => remove.mutate({ id: accountId })}>
            {remove.isPending ? <Spinner /> : <Trash2Icon />}
            Si, Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
