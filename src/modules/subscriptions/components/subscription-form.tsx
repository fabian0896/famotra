import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatISO } from 'date-fns';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { Subscriptions } from '../services/subscriptions';
import { subscriptionsQueryOptions } from '../query-options/subscriptions';
import { addSubscriptionsSchema } from '../models/schemas';
import type {
  Subscription,
  SubscriptionInsert,
  SubscriptionTypes,
} from '../models/subscriptions.models';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { formatError } from '@/lib/format-error';
import { useAppForm } from '@/hooks/form';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function SubscriptionForm({
  type,
  subscription,
  onSuccess,
}: {
  type: SubscriptionTypes;
  subscription?: Subscription;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const { data } = useQuery(accountsQueryOptions);
  const accounts = data?.accounts || [];

  const isEdit = Boolean(subscription);

  const create = useMutation({
    mutationFn: Subscriptions.upsert,
    onSuccess: () => {
      toast.success('Suscripcion creada correctamente!');
      onSuccess?.();
    },
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsQueryOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: accountsQueryOptions.queryKey });
    },
  });

  const form = useAppForm({
    defaultValues: {
      id: subscription?.id,
      name: subscription?.name || '',
      icon: subscription?.icon || '',
      frequency: subscription?.frequency || 0,
      account_id: subscription?.account_id || accounts.at(0)?.id,
      start_day: subscription?.start_day || formatISO(new Date()),
      amount: Math.abs(subscription?.amount || 0),
      subscription_type: type,
      status: subscription?.status || 'active',
    } as SubscriptionInsert,
    validators: {
      onSubmit: addSubscriptionsSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <React.Fragment>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <form.AppField
              name="amount"
              children={(field) => <field.AmountField label="Valor" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <form.AppField
                name="category_id"
                children={(field) => <field.CategoryField type={type} label="Categoría" />}
              />
              <Link to="/dashboard/categories" className="text-sm inline-block mt-2 text-primary">
                + Agregar Categoría
              </Link>
            </div>
            <div>
              <form.AppField
                name="account_id"
                children={(field) => <field.AccountsField label="Cuenta" />}
              />
              <Link to="/dashboard/accounts" className="text-sm inline-block mt-2 text-primary">
                + Agregar Cuenta
              </Link>
            </div>
          </div>
          <form.AppField
            name="start_day"
            children={(field) => <field.DateField label="Fecha de inicio" />}
          />
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton>{isEdit ? 'Editar' : 'Agregar'}</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </form>
    </React.Fragment>
  );
}
