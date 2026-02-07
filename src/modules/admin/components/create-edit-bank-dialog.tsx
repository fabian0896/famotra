import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bankFormSchema } from '../models/banks.schemas';
import { BanksAdminService } from '../services/banks-admin.service';
import { ImageUpload } from './image-upload';
import type { Bank, BankInsert } from '../models/banks.models';
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
import { QueryKeys } from '@/constants/query-keys';
import { Button } from '@/components/ui/button';

export function CreateEditBankDialog({
  isOpen,
  bank,
  children,
  onOpenChange,
}: {
  isOpen?: boolean;
  bank?: Bank;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: BanksAdminService.upsert,
    onSuccess: () => {
      toast.success(bank ? 'Banco actualizado correctamente' : 'Banco agregado correctamente');
    },
    onError: () => {
      toast.error('Algo salió mal, por favor intenta más tarde');
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: [QueryKeys.BANKS] });
    },
  });

  useEffect(() => {
    if (isOpen === undefined) return;
    setOpen(isOpen);
  }, [isOpen]);

  const form = useAppForm({
    defaultValues: {
      id: bank?.id || undefined,
      name: bank?.name || '',
      logo: bank?.logo || '',
    } satisfies BankInsert,
    validators: {
      onSubmit: bankFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutation.mutateAsync(value);
      formApi.reset();
      setOpen(false);
      onOpenChange?.(false);
    },
  });

  const handleClose = (state: boolean) => {
    onOpenChange?.(state);
    setOpen(state);
    form.reset();
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
            <DialogTitle>{bank ? 'Editar' : 'Nuevo'} Banco</DialogTitle>
            <DialogDescription>
              {bank ? 'Edita el banco con los nuevos datos' : 'Agrega un nuevo banco a la lista'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 mb-8">
            <form.Field
              name="logo"
              children={(field) => (
                <ImageUpload
                  value={field.state.value}
                  onChange={(url) => field.handleChange(url)}
                  hasError={field.state.meta.isTouched && !field.state.meta.isValid}
                />
              )}
            />
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  id="name"
                  name="name"
                  placeholder="Banco Nacional"
                  label="Nombre"
                />
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>{bank ? 'Guardar' : 'Agregar'}</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
