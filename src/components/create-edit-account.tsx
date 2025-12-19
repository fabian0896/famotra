import { useEffect, useState } from 'react';
import type { Account } from '@/models/accounts.models';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppForm } from '@/hooks/form';

const addAccountSchema = {
  name: 'string',
  bank_name: 'string',
  balance: 'number',
};

interface AccountDialogProps {
  account?: Account;
  isOpen?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function CreateEditAccountDialog({
  account,
  isOpen,
  children,
  onOpenChange,
}: AccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState<string>('otro');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (isOpen === undefined) return;
    setOpen(isOpen);
  }, [isOpen]);

  const form = useAppForm({
    defaultValues: {
      id: account?.id || undefined,
      name: account?.name || '',
      bank_name: account?.bank?.name || 'otro',
      balance: account?.balance?.toString() || '0',
    },
  });

  const handleClose = (state: boolean) => {
    onOpenChange?.(state);
    setOpen(state);
  };

  const isEditing = !!account;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar cuenta' : 'Nueva cuenta'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edita tu cuenta con los nuevos datos'
              : 'Agrega una nueva cuenta para administrar mejor tus finanzas'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la cuenta</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Cuenta nómina"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank">Banco</Label>
            <Select value={bankName} onValueChange={(value: string) => setBankName(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un banco" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Saldo</Label>
            <Input
              id="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <DialogClose asChild>
              <div className="flex-1">Cancelar</div>
            </DialogClose>
            <Button type="submit" className="flex-1">
              {isEditing ? 'Guardar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
