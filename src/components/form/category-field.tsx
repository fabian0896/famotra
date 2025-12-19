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
import { categoriesQueryOptions } from '@/query-options/categories';
import { useFieldContext } from '@/hooks/form';

export function CategoryField({ lablel, type }: { lablel?: string; type: 'incomes' | 'expenses' }) {
  const field = useFieldContext<string>();
  const { data, isLoading } = useQuery(categoriesQueryOptions);

  const categories = data?.[type] ?? [];
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isError}>
      <FieldLabel>{lablel}</FieldLabel>
      <Select onValueChange={(value) => field.setValue(value)}>
        <SelectTrigger>
          <SelectValue
            placeholder={isLoading ? 'Cargando categorías...' : 'Selecciona una categoría'}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{lablel}</SelectLabel>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Spinner />
              </div>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
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
