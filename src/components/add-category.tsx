import { LucidePlus } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import type { CategoryInsert, TransactionType } from '@/models/categories.models';
import { useAppForm } from '@/hooks/form';
import { Categories } from '@/services/categories';
import { categoriesQueryOptions } from '@/query-options/categories';

const addCategorySchema = z.object({
  name: z.string(),
  icon: z.emoji(),
  transaction_type: z.enum(['income', 'expense', 'transfer']),
});

export function AddCategory({ type }: { type: TransactionType }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: Categories.create,
    onSuccess: () => {
      toast.success('Cargeoría agregada correctamente');
    },
    onError: () => {
      toast.error('Algo salio mál por favor intenta más tarde');
    },
    onSettled: () => {
      const queryKey = categoriesQueryOptions.queryKey;
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      icon: '',
      transaction_type: type,
    } as CategoryInsert,
    validators: {
      onSubmit: addCategorySchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value);
      formApi.reset();
      setOpen(false);
    },
  });

  const handleClose = (state: boolean) => {
    setOpen(state);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <div className="flex flex-col gap-1.5">
        <DialogTrigger asChild>
          <button className="h-16 w-16 rounded-full bg-primary-foreground flex transition-all justify-center items-center hover:scale-105">
            <LucidePlus className="text-primary" size={30} strokeWidth={3} />
          </button>
        </DialogTrigger>
        <span className="text-muted-foreground text-center font-medium text-sm">Agregar</span>
      </div>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader className="mb-8">
            <DialogTitle>Nueva Categoría</DialogTitle>
            <DialogDescription>Agrega una nueva categoría para tus transacciones</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 mb-8">
            <form.AppField name="icon" children={(field) => <field.EmojiField />} />
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField id="name" name="name" placeholder="Salidas" label="Nombre" />
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
              <form.SubmitButton>Agregar</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
