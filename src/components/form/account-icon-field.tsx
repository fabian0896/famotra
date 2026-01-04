import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Field, FieldError } from '../ui/field';
import { Label } from '../ui/label';
import { ACOUNTS_ICONS } from '@/modules/accounts/constants/accounts-icons';
import { useFieldContext } from '@/hooks/form';

export function AccountIconField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isError}>
      <Label>{label}</Label>
      <RadioGroupPrimitive.Root
        value={field.state.value}
        onValueChange={field.setValue}
        className="grid grid-cols-6 gap-4"
      >
        {Object.values(ACOUNTS_ICONS).map((value) => (
          <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            value={value.id}
            className="w-full cursor-pointer aspect-square border border-muted rounded text-foreground flex items-center justify-center transition-all data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
            key={value.id}
          >
            <value.Icon />
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}
