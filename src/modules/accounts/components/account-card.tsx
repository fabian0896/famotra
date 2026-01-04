import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { NumericFormat } from 'react-number-format';
import { CreateEditAccountDialog } from './create-edit-account';
import { DeleteAccountDialog } from './delete-account-dialog';
import { AccountIcon } from './account-icon';
import type { Account } from '../models/accounts.models';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Accounts } from '@/modules/accounts/services/accounts';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { QueryKeys } from '@/constants/query-keys';

export function AccountCard({ account }: { account: Account }) {
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: Accounts.remove,
    onSuccess: () => {
      toast.info('Se eliminó la cuenta correctamente');
    },
    onError: () => {
      toast.error('Algo salió mal por favor intenta nuevamente');
    },
    onSettled: () => {
      const queryKey = accountsQueryOptions.queryKey;
      queryClient.invalidateQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey: [QueryKeys.TOTAL_BALANCES] });
    },
  });

  const handleOpenEdit = () => {
    setEditOpen(true);
  };
  return (
    <>
      <CreateEditAccountDialog isOpen={editOpen} onOpenChange={setEditOpen} account={account} />
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md py-2">
        {/* Color accent bar */}
        <div className="absolute left-0 top-0 h-full w-1" />

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Icon with bank color */}
            <AccountIcon className="h-10 w-10 rounded-full overflow-hidden" account={account} />

            <div className="flex flex-col">
              <span className="font-medium text-foreground">{account.name}</span>
              <span className="text-sm text-muted-foreground capitalize">
                {account.bank?.name ?? account.custom_bank_name ?? 'Sin banco'}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <NumericFormat
              value={account.balance}
              className="text-lg font-semibold text-foreground"
              prefix="$ "
              thousandSeparator="."
              decimalSeparator=","
              displayType="text"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleOpenEdit}>Editar</DropdownMenuItem>
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
