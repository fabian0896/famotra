import { NumericFormat } from 'react-number-format';
import { useFieldContext } from '@/hooks/form';
import { InputCard } from '@/components/input-card';
import { FieldError } from '@/components/ui/field';

export function AmountCardField({
  label,
  icon,
  optional,
  ...props
}: {
  label: string;
  icon?: React.ReactNode;
  optional?: boolean;
} & React.ComponentProps<'input'>) {
  const field = useFieldContext<number>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className="flex flex-col gap-1.5">
      <InputCard data-invalid={isError || undefined}>
        {icon && <InputCard.Icon>{icon}</InputCard.Icon>}
        <InputCard.Content>
          <InputCard.Label optional={optional}>{label}</InputCard.Label>
          <NumericFormat
            customInput={InputCard.Input}
            name={field.name}
            value={field.state.value}
            onValueChange={({ floatValue }) => field.handleChange(floatValue ?? 0)}
            onBlur={field.handleBlur}
            prefix="$ "
            thousandSeparator
            disabled={props.disabled}
          />
        </InputCard.Content>
      </InputCard>
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
