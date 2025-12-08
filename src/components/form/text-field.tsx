import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { useFieldContext } from '@/hooks/form';

export default function TextField({
  label,
  ...props
}: { label: string } & React.ComponentProps<'input'>) {
  const field = useFieldContext<string>();
  const isError = field.state.meta.isDirty && !field.state.meta.isValid;
  return (
    <Field data-invalid={isError}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
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
