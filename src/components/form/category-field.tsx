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
import type { CategoryTypes } from '@/modules/categories/models/categories.models';
import { categoriesQueryOptions } from '@/modules/categories/query-options/categories';
import { useFieldContext } from '@/hooks/form';

export function CategoryField({ label, type }: { label?: string; type: CategoryTypes }) {
  const field = useFieldContext<string>();
  const { data, isLoading } = useQuery(categoriesQueryOptions);

  const categories = data?.[type] || [];
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isError}>
      <FieldLabel>{label}</FieldLabel>
      <Select value={field.state.value} onValueChange={(value) => field.setValue(value)}>
        <SelectTrigger>
          <SelectValue
            placeholder={isLoading ? 'Cargando categorías...' : 'Selecciona categoría'}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
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
