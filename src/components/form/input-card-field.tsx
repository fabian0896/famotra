import { useFieldContext } from '@/hooks/form';
import { InputCard } from '@/components/input-card';
import { FieldError } from '@/components/ui/field';

export function InputCardField({
  label,
  icon,
  optional,
  ...props
}: {
  label: string;
  icon?: React.ReactNode;
  optional?: boolean;
} & React.ComponentProps<'input'>) {
  const field = useFieldContext<string>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className="flex flex-col gap-1.5">
      <InputCard data-invalid={isError || undefined}>
        {icon && <InputCard.Icon>{icon}</InputCard.Icon>}
        <InputCard.Content>
          <InputCard.Label optional={optional}>{label}</InputCard.Label>
          <InputCard.Input
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            {...props}
          />
        </InputCard.Content>
      </InputCard>
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
