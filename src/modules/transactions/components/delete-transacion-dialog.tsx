import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { sileo } from 'sileo';
import { useState } from 'react';
import { Transactions } from '../services/transactions';
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

export function DeleteTransactionDialog({
  transactionId,
  children,
  onRemoved,
}: {
  transactionId: string;
  children: React.ReactNode;
  onRemoved?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Transactions.remove,
    onSuccess: () => {
      sileo.success({ title: 'Transacción eliminada correctamente' });
      setOpen(false);
      onRemoved?.();
    },
    onError: (error) => {
      const { message } = formatError(error);
      sileo.error({
        title: 'Error al eliminar',
        description: message,
      });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
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
          <AlertDialogTitle>¿Eliminar transacción?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => remove.mutate({ id: transactionId })}
          >
            {remove.isPending ? <Spinner /> : <Trash2Icon />}
            Si, Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
