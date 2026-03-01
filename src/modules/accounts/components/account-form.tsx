import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo } from 'sileo';
import { DollarSignIcon, PenLineIcon } from 'lucide-react';
import { addAccountSchema } from '../models/schemas';
import type { Account, AccountInsert } from '../models/accounts.models';
import { useAppForm } from '@/hooks/form';
import { Accounts } from '@/modules/accounts/services/accounts';
import { QueryKeys } from '@/constants/query-keys';
import { Footer } from '@/components/dashboard-layout';

export function AccountForm({ account, onSuccess }: { account?: Account; onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(account);

  const create = useMutation({
    mutationFn: Accounts.upsert,
    onSuccess: () => {
      sileo.success({ title: `Cuenta ${isEditing ? 'editad' : 'creada'} correctamente` });
      onSuccess?.();
    },
    onError: () => {
      sileo.error({ title: 'Algo salió mal, por favor intenta más tarde' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACCOUNTS] });
    },
  });

  const form = useAppForm({
    defaultValues: {
      id: account?.id || undefined,
      name: account?.name || '',
      bank_id: account?.bank?.id || ('' as string | undefined),
      balance: account?.balance || 0,
      custom_bank_icon: account?.custom_bank_icon || undefined,
    } satisfies AccountInsert,
    validators: {
      onSubmit: addAccountSchema,
    },
    onSubmit: async ({ value }) => {
      await create.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className=" flex flex-col gap-3 pt-6">
        <form.AppField
          name="name"
          children={(field) => (
            <field.InputCardField
              icon={<PenLineIcon />}
              id="name"
              name="name"
              placeholder="Ingresa el nombre de la cuenta"
              label="Nombre de cuenta"
            />
          )}
        />
        <form.AppField
          name="balance"
          children={(field) => (
            <field.MoneyCardField
              icon={<DollarSignIcon />}
              disabled={isEditing}
              label="Balance inicial"
            />
          )}
        />
        <form.AppField
          name="bank_id"
          children={(field) => <field.BankField allowCustom label="Nombre de banco" />}
        />
        <form.Subscribe selector={(state) => state.values.bank_id}>
          {(bankId) =>
            !bankId && (
              <div className="pt-6">
                <form.AppField
                  name="custom_bank_icon"
                  children={(field) => <field.AccountIconField label="Icono de la cuenta" />}
                />
              </div>
            )
          }
        </form.Subscribe>
      </div>
      <Footer>
        <form.AppForm>
          <form.SubmitButton>{isEditing ? 'Editar' : 'Crear'} cuenta</form.SubmitButton>
        </form.AppForm>
      </Footer>
    </form>
  );
}
