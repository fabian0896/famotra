import { LucidePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
import type { Category, CategoryInsert, CategoryTypes } from '@/models/categories.models';
import { CATEGORY_TYPES } from '@/models/categories.models';
import { useAppForm } from '@/hooks/form';
import { Categories } from '@/services/categories';
import { categoriesQueryOptions } from '@/query-options/categories';

const addCategorySchema = z.object({
  name: z.string().nonempty({ message: 'Debes ingresar un nombre para la categoría' }),
  icon: z.emoji(),
  type: z.enum(['income', 'expense']),
});

export function AddCategotyButton() {
  return (
    <DialogTrigger asChild>
      <button className="flex flex-col justify-center items-center gap-1.5 group">
        <div className="bg-primary/20 rounded-full w-16 h-16 text-2xl flex items-center justify-center">
          <span className="group-hover:scale-110 group-hover:rotate-12 transition-all">
            <LucidePlus className="text-primary" size={30} strokeWidth={3} />
          </span>
        </div>
        <span className="text-muted-foreground text-center font-medium text-sm lowercase first-letter:capitalize group-hover:text-foreground">
          Agregar
        </span>
      </button>
    </DialogTrigger>
  );
}

export function CreateEditCategoryDialog({
  isOpen,
  type,
  category,
  children,
  onOpenChange,
}: {
  isOpen?: boolean;
  type?: CategoryTypes;
  category?: Category;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: Categories.upsert,
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

  useEffect(() => {
    if (isOpen === undefined) return;
    setOpen(isOpen);
  }, [isOpen]);

  const form = useAppForm({
    defaultValues: {
      id: category?.id || undefined,
      name: category?.name || '',
      icon: category?.icon || '',
      type: category?.type || type,
    } as CategoryInsert,
    validators: {
      onSubmit: addCategorySchema,
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
            <DialogTitle>{category ? 'Editar' : 'Nueva'} Categoría</DialogTitle>
            <DialogDescription>
              {category
                ? 'Edita tu categoría con los nuevos datos'
                : `Agrega una nueva categoría para tus ${CATEGORY_TYPES[type || 'income'].toLowerCase()}`}
            </DialogDescription>
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
