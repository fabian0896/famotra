import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo } from 'sileo';
import { PencilLine, TargetIcon } from 'lucide-react';
import { Categories } from '../services/categories';
import { addCategorySchema } from '../models/schemas';
import type { CategoryInsert } from '../models/categories.models';
import { QueryKeys } from '@/constants/query-keys';
import { useAppForm } from '@/hooks/form';
import { Footer } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';

export function CategoryForm() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: Categories.upsert,
    onSuccess: () => {
      sileo.success({ title: 'Cargeoría agregada correctamente' });
    },
    onError: () => {
      sileo.error({ title: 'Algo salio mál por favor intenta más tarde' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
    },
  });

  const form = useAppForm({
    defaultValues: {
      id: undefined,
      name: '',
      icon: '',
      type: 'expense',
    } as CategoryInsert,
    validators: {
      onSubmit: addCategorySchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <form
      className="pt-5 flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="py-4 flex flex-col gap-2.5">
        <div className="size-20 text-4xl bg-red-500/15 rounded-3xl mx-auto grid place-items-center">
          🚚
        </div>
        <h3 className="text-lg font-semibold text-foreground text-center">Food & Dining</h3>
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium mb-3">Choose Icon</p>
        <div className="bg-card p-4 rounded-2xl grid grid-cols-7 gap-2.5">
          {Array.from({ length: 28 }, (_, i) => i).map((key) => (
            <div
              className="w-full aspect-square bg-muted rounded-lg grid place-items-center text-sm"
              key={key}
            >
              💵
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="bg-card px-4.5 py-1.5 h-14 rounded-2xl flex gap-3 items-center">
          <PencilLine className="size-5 text-muted-foreground" />
          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-0-5">
              Category Name
            </label>
            <input className="text-foreground font-medium" value="Food & Dining" type="text" />
          </div>
        </div>

        <div className="bg-card px-4.5 py-1.5 h-14 rounded-2xl flex gap-3 items-center">
          <TargetIcon className="size-5 text-muted-foreground" />
          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-0-5">
              Monthly Budget <span className="text-muted-foreground/60">(opcional)</span>
            </label>
            <input className="text-foreground font-medium" value="$500.00" type="text" />
          </div>
        </div>
      </div>
      <Footer>
        <Button className="w-full">Crear categoría</Button>
      </Footer>
    </form>
  );
}
