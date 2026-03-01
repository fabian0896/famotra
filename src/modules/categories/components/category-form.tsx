import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo } from 'sileo';
import { CheckIcon, PencilLineIcon, SmilePlusIcon, TargetIcon } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Categories } from '../services/categories';
import { addCategorySchema } from '../models/schemas';
import type { CategoryWithBudget } from '../models/categories.models';
import { QueryKeys } from '@/constants/query-keys';
import { useAppForm } from '@/hooks/form';
import { Footer } from '@/components/dashboard-layout';
import { generateColor } from '@/lib/color-utils';

export function CategoryForm({ category }: { category?: CategoryWithBudget }) {
  const [categoryColor] = useState(() => generateColor());
  const router = useRouter();
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: Categories.upsert,
    onSuccess: () => {
      sileo.success({ title: 'Cargeoría agregada correctamente' });
      if (router.history.canGoBack()) router.history.back();
      else router.navigate({ to: '/dashboard/categories' });
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
      id: category?.id || undefined,
      name: category?.name || '',
      icon: category?.icon || '',
      type: category?.type || 'expense',
      color: category?.color || categoryColor,
      budget: category?.budget?.amount,
    },
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
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={({ values }) => ({ icon: values.icon, name: values.name, color: values.color })}
      >
        {({ icon, name, color }) => (
          <div className="py-4 flex flex-col gap-2.5">
            <div
              data-value={icon || undefined}
              style={{ '--color': color } as React.CSSProperties}
              className="size-20 transition-all text-4xl bg-muted border border-dashed border-muted-foreground rounded-3xl mx-auto grid place-items-center data-value:bg-(--color)/15 data-value:border-none"
            >
              {icon || <SmilePlusIcon className="size-9 text-muted-foreground" />}
            </div>
            <h3 className="text-lg font-semibold text-foreground text-center">
              {name || 'Nombre de la categoría'}
            </h3>
          </div>
        )}
      </form.Subscribe>
      <form.AppField
        name="type"
        children={(field) => <field.CategoryTypeField label="Tipo de categoría" />}
      />
      <form.AppField
        name="icon"
        children={(field) => <field.EmojiGridField label="Selecciona Emoji" />}
      />
      <div className="flex flex-col gap-3">
        <form.AppField
          name="name"
          children={(field) => (
            <field.InputCardField icon={<PencilLineIcon />} label="Nombre de la categoría" />
          )}
        />
        <form.AppField
          name="budget"
          children={(field) => (
            <field.AmountCardField optional icon={<TargetIcon />} label="Presupuesto" />
          )}
        />
      </div>
      <Footer>
        <form.AppForm>
          <form.SubmitButton className="w-full">
            <CheckIcon />
            {category ? 'Editar' : 'Agregar'}
          </form.SubmitButton>
        </form.AppForm>
      </Footer>
    </form>
  );
}
