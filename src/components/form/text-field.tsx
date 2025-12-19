import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { useFieldContext } from '@/hooks/form';

export function TextField({ label, ...props }: { label: string } & React.ComponentProps<'input'>) {
  const field = useFieldContext<string>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;
  const fieldId = props.id ?? field.name;
  return (
    <Field data-invalid={isError}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input
        id={fieldId}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}
