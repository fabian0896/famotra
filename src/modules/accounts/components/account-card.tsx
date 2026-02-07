import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateEditAccountDialog } from './create-edit-account';
import { DeleteAccountDialog } from './delete-account-dialog';
import { AccountIcon } from './account-icon';
import type { Account } from '../models/accounts.models';
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
import { FormattedMoney } from '@/components/formatted-money';
import { cn } from '@/lib/utils';

function getBalanceAccent(balance: number) {
  if (balance > 0) return 'bg-emerald-500';
  if (balance < 0) return 'bg-red-500';
  return 'bg-muted-foreground/40';
}

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
      <div
        className={cn(
          'group relative rounded-xl border bg-card',
          'transition-all duration-200',
          'hover:shadow-md hover:border-border/80'
        )}
      >
        {/* Balance accent bar */}
        <div
          className={cn(
            'absolute left-0 top-3 bottom-3 w-[3px] rounded-full',
            getBalanceAccent(account.balance)
          )}
        />

        {/* Action menu */}
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

        <div className="flex flex-col items-center px-5 pt-6 pb-5">
          {/* Account icon */}
          <AccountIcon
            className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-border/50"
            account={account}
          />

          {/* Account info */}
          <div className="mt-4 text-center w-full">
            <p className="font-medium text-foreground text-sm truncate">{account.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize truncate">
              {account.bank?.name ?? account.custom_bank_name ?? 'Sin banco'}
            </p>
          </div>

          {/* Balance */}
          <div className="mt-4 pt-4 border-t border-border/50 w-full text-center">
            <FormattedMoney
              className="text-xl font-semibold tracking-tight"
              value={account.balance}
            />
          </div>
        </div>
      </div>
    </>
  );
}
