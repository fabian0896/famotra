import { NumericFormat } from 'react-number-format';
import { useFieldContext } from '@/hooks/form';
import { InputCard } from '@/components/input-card';
import { FieldError } from '@/components/ui/field';

export function MoneyCardField({
  label,
  icon,
  disabled,
}: {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const field = useFieldContext<number>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className="flex flex-col gap-1.5">
      <InputCard data-invalid={isError || undefined}>
        {icon && <InputCard.Icon>{icon}</InputCard.Icon>}
        <InputCard.Content>
          <InputCard.Label>{label}</InputCard.Label>
          <NumericFormat
            customInput={InputCard.Input}
            name={field.name}
            value={field.state.value || ''}
            onValueChange={({ floatValue }) => field.handleChange(floatValue ?? 0)}
            onBlur={field.handleBlur}
            thousandSeparator="."
            decimalSeparator=","
            prefix="$ "
            placeholder="$ 0"
            disabled={disabled}
          />
        </InputCard.Content>
      </InputCard>
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
