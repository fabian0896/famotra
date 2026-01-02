import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CATEGORY_TYPES } from '../models/categories.models';
import { addCategorySchema } from '../models/schemas';
import type { Category, CategoryInsert, CategoryTypes } from '../models/categories.models';
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
import { Categories } from '@/modules/categories/services/categories';
import { categoriesQueryOptions } from '@/modules/categories/query-options/categories';
import { Button } from '@/components/ui/button';

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
