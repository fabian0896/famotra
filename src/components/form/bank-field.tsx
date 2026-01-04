import { useQuery } from '@tanstack/react-query';
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
import { banksQueryOptions } from '@/query-options/banks';
import { useFieldContext } from '@/hooks/form';

export function BankField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const { data, isLoading } = useQuery(banksQueryOptions);

  const banks = data ?? [];
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isError}>
      <FieldLabel>{label}</FieldLabel>
      <Select value={field.state.value} onValueChange={(value) => field.setValue(value)}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? 'Cargando bancos...' : 'Selecciona un banco'} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Spinner />
              </div>
            ) : (
              banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  <img className="w-4 h-4 rounded-full" src={bank.logo} alt={bank.name} />
                  {bank.name}
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
