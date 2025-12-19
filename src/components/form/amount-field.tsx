import { NumericFormat } from 'react-number-format';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { useFieldContext } from '@/hooks/form';

export function AmountField({
  label,
  ...props
}: { label: string } & React.ComponentProps<'input'>) {
  const field = useFieldContext<number>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;
  const fieldId = props.id ?? field.name;
  return (
    <Field data-invalid={isError}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <NumericFormat
        type="text"
        customInput={Input}
        id={fieldId}
        name={field.name}
        value={field.state.value}
        onValueChange={({ floatValue }) => field.handleChange(floatValue ?? 0)}
        onBlur={field.handleBlur}
        prefix="$ "
        thousandSeparator
      />
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}
