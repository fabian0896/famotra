import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CheckIcon } from 'lucide-react';
import { FieldError } from '../ui/field';
import { ACOUNTS_ICONS } from '@/modules/accounts/constants/accounts-icons';
import { useFieldContext } from '@/hooks/form';
import { cn } from '@/lib/utils';

export function AccountIconField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className="flex flex-col gap-3" data-invalid={isError || undefined}>
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <RadioGroupPrimitive.Root
        value={field.state.value}
        onValueChange={field.setValue}
        className="grid grid-cols-4 gap-2"
      >
        {Object.values(ACOUNTS_ICONS).map((value) => (
          <RadioGroupPrimitive.Item
            key={value.id}
            data-slot="radio-group-item"
            value={value.id}
            className={cn(
              'group relative w-full aspect-square cursor-pointer rounded-2xl',
              'bg-card text-muted-foreground',
              'flex items-center justify-center',
              'border-2 border-transparent',
              'transition-all duration-150',
              'hover:bg-muted hover:text-foreground hover:scale-105',
              'active:scale-95',
              'data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:border-primary/30'
            )}
          >
            <value.Icon className="size-6 transition-transform duration-150" />
            <span className="absolute top-1.5 right-1.5 size-4 rounded-full bg-primary grid place-items-center opacity-0 scale-50 transition-all duration-150 group-data-[state=checked]:opacity-100 group-data-[state=checked]:scale-100">
              <CheckIcon className="size-2.5 text-primary-foreground stroke-3" />
            </span>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
