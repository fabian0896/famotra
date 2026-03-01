import { AlertCircleIcon } from 'lucide-react';
import { sileo } from 'sileo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createTokenSchema } from '../models/schemas';
import { tokensQueryOptions } from '../query-options/tokens';
import { TokenService } from '../services/tokens';
import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppForm } from '@/hooks/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatError } from '@/lib/format-error';

export function CreateTokenDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: TokenService.create,
    onSuccess: () => {
      setOpen(false);
      sileo.success({ title: 'Token creado correctamente' });
    },
    onError: (error) => {
      const { message } = formatError(error);
      sileo.error({ title: 'Algo salió mal', description: message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tokensQueryOptions.queryKey });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
    },
    validators: {
      onSubmit: createTokenSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader className="mb-6">
            <DialogTitle>Crear Token</DialogTitle>
            <DialogDescription>Crea un nuevo token para usar en tus shortcuts</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 mb-6">
            <form.AppField name="name" children={(field) => <field.TextField label="Nombre" />} />
            <form.AppField
              name="description"
              children={(field) => <field.TextField label="Descripción " />}
            />
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>Token privado</AlertTitle>
              <AlertDescription>
                Este token es privado por lo que no lo debes exponerlo ya que puede conllevar
                problemas de seguridad.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Crear token </form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
