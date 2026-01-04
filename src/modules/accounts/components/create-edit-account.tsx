import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAccountSchema } from '../models/schemas';
import type { Account, AccountInsert } from '../models/accounts.models';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppForm } from '@/hooks/form';
import { Accounts } from '@/modules/accounts/services/accounts';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CreateEditAccountDialog({
  account,
  isOpen,
  children,
  onOpenChange,
}: {
  account?: Account;
  isOpen?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const [tab, setTab] = useState('bank');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!account;

  const create = useMutation({
    mutationFn: Accounts.upsert,
    onSuccess: () => {
      toast.success('Cuenta agregada correctamente');
    },
    onError: () => {
      toast.error('Algo salió mal, por favor intenta más tarde');
    },
    onSettled: () => {
      const queryKey = accountsQueryOptions.queryKey;
      queryClient.invalidateQueries({ queryKey });
    },
  });

  useEffect(() => {
    if (isOpen === undefined) return;
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (account === undefined) return;
    if (!account.bank_id) setTab('custom');
  }, [account]);

  const form = useAppForm({
    defaultValues: {
      id: account?.id || undefined,
      name: account?.name || '',
      bank_id: account?.bank?.id || undefined,
      balance: account?.balance || 0,
      custom_bank_name: account?.custom_bank_name || undefined,
      custom_bank_icon: account?.custom_bank_icon || undefined,
    } satisfies AccountInsert,
    validators: {
      onSubmit: addAccountSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value);
      formApi.reset();
      setOpen(false);
      onOpenChange?.(false);
    },
  });

  const handleClose = (state: boolean) => {
    onOpenChange?.(state);
    setOpen(state);
    if (!state) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {children}
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader className="mb-8">
            <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} cuenta</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Edita tu cuenta con los nuevos datos'
                : 'Agrega una nueva cuenta para administrar mejor tus finanzas'}
            </DialogDescription>
          </DialogHeader>
          <div className=" flex flex-col gap-8 mb-8">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  id="name"
                  name="name"
                  placeholder="Ahorro"
                  label="Nombre de cuenta"
                />
              )}
            />
            <form.AppField
              name="balance"
              children={(field) => (
                <field.AmountField
                  id="balance"
                  disabled={isEditing}
                  name="balance"
                  label="Balance"
                />
              )}
            />
            <Tabs value={tab} onValueChange={setTab} defaultValue="bank">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="bank">Cuenta bancaria</TabsTrigger>
                <TabsTrigger value="custom">Cuenta personalizada</TabsTrigger>
              </TabsList>
              <TabsContent value="bank">
                <form.AppField
                  name="bank_id"
                  children={(field) => <field.BankField label="Nombre de banco" />}
                />
              </TabsContent>
              <TabsContent value="custom">
                <div className="flex flex-col gap-8">
                  <form.AppField
                    name="custom_bank_name"
                    children={(field) => (
                      <field.TextField placeholder="Efectivo" label="Nombre personalizado" />
                    )}
                  />
                  <form.AppField
                    name="custom_bank_icon"
                    children={(field) => <field.AccountIconField label="Icono" />}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>{isEditing ? 'Editar' : 'Crear'} cuenta</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
