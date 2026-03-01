import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { sileo } from 'sileo';
import { BanksAdminService } from '../services/banks-admin.service';
import { CreateEditBankDialog } from './create-edit-bank-dialog';
import { DeleteBankDialog } from './delete-bank-dialog';
import type { Bank } from '../models/banks.models';
import { QueryKeys } from '@/constants/query-keys';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';

export function BankCard({ bank }: { bank: Bank }) {
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: BanksAdminService.remove,
    onSuccess: () => {
      sileo.info({ title: 'Se eliminó el banco correctamente' });
    },
    onError: () => {
      sileo.error({ title: 'Algo salió mal, por favor intenta nuevamente' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BANKS] });
    },
  });

  return (
    <div className="relative border border-border bg-card rounded-xl p-4 flex flex-col items-center">
      <CreateEditBankDialog isOpen={editOpen} onOpenChange={setEditOpen} bank={bank} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8">
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DeleteBankDialog bank={bank} onConfirm={() => remove.mutate({ id: bank.id })}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} variant="destructive">
              {remove.isPending ? <Spinner /> : <Trash2 className="size-4" />}
              Eliminar
            </DropdownMenuItem>
          </DeleteBankDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center mb-3">
        <img src={bank.logo} alt={bank.name} className="w-full h-full object-cover" />
      </div>
      <p title={bank.name} className="text-foreground text-center font-medium text-sm line-clamp-1">
        {bank.name}
      </p>
    </div>
  );
}
