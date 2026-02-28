import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Field, FieldError, FieldLabel } from '../ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Spinner } from '../ui/spinner';
import { useFieldContext } from '@/hooks/form';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { AccountIcon } from '@/modules/accounts/components/account-icon';

export function AccountsField({
  label,
  ...props
}: { label?: string } & React.ComponentProps<typeof Field>) {
  const field = useFieldContext<string>();
  const { data, isLoading } = useQuery(accountsQueryOptions());

  const accounts = data?.accounts ?? [];
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  const selected = React.useMemo(() => {
    return accounts.find((a) => a.id === field.state.value);
  }, [field.state.value, accounts]);

  return (
    <Field {...props} data-invalid={isError}>
      <FieldLabel>{label}</FieldLabel>
      <Select value={field.state.value} onValueChange={(value) => field.setValue(value)}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? 'Cargando cuentas...' : 'Selecciona cuenta'}>
            {selected && (
              <div className="flex items-center gap-2">
                <AccountIcon account={selected} className="w-4 h-4 rounded-full" />
                <span>{selected.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Spinner />
              </div>
            ) : (
              accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <AccountIcon account={account} className="w-6 h-6 rounded-full" />
                  <div>
                    <p>{account.name}</p>
                    <NumericFormat
                      className="text-xs text-muted-foreground"
                      value={account.balance}
                      displayType="text"
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={true}
                      prefix="$"
                    />
                  </div>
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}
