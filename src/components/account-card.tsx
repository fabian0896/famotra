import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateEditAccountDialog } from './create-edit-account';
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
import type { Account } from '@/models/accounts.models';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Accounts } from '@/services/accounts';
import { accountsQueryOptions } from '@/query-options/accounts';

interface AccountCardProps {
  account: Account;
}

function DeleteAccountDialog({
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

export function AccountCard({ account }: AccountCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Accounts.remove,
    onSuccess: () => {
      toast.info('Se eliminó la cuenta correctamente');
      console.log('bien');
    },
    onError: () => {
      toast.error('Algo salió mal por favor intenta nuevamente');
      console.log('mal');
    },
    onSettled: () => {
      const queryKey = accountsQueryOptions.queryKey;
      queryClient.invalidateQueries({ queryKey });
      console.log('bien bien');
    },
  });

  const handleOpenEdit = () => {
    setEditOpen(true);
  };
  return (
    <>
      <CreateEditAccountDialog isOpen={editOpen} onOpenChange={setEditOpen} account={account} />
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Color accent bar */}
        <div className={`absolute left-0 top-0 h-full w-1`} />

        <div className="flex items-center justify-between p-4 pl-5">
          <div className="flex items-center gap-3">
            {/* Icon with bank color */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={account.bank?.logo}
                alt={account.bank?.name}
              />
            </div>

            <div className="flex flex-col">
              <span className="font-medium text-foreground">{account.name}</span>
              <span className="text-sm text-muted-foreground capitalize">
                {account.bank?.name ?? 'Sin banco'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">{account.balance}</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleOpenEdit}>Editar</DropdownMenuItem>
                <DeleteAccountDialog
                  onConfirm={() => remove.mutate({ id: account.id })}
                  account={account}
                >
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    Eliminar
                  </DropdownMenuItem>
                </DeleteAccountDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </>
  );
}
