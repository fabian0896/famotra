import React from 'react';
import { NumericFormat } from 'react-number-format';
import type { CategoryTypes } from '@/modules/categories/models/categories.models';
import { cn } from '@/lib/utils';
import { useFieldContext } from '@/hooks/form';
import { FieldError } from '@/components/ui/field';

const colorByType: Record<CategoryTypes | 'neutral', string> = {
  expense: 'text-red-400',
  income: 'text-emerald-400',
  neutral: 'text-blue-400',
};

export function TransactionAmountField({ type }: { type: CategoryTypes | 'neutral' }) {
  const field = useFieldContext<number>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;
  const inputRef = React.useRef<HTMLInputElement>(null);

  // autoFocus is blocked by iOS Safari unless focus() is called close to the
  // original user gesture. A short delay keeps us within that window.
  React.useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 items-center">
      <p className="text-sm font-medium text-muted-foreground">Valor</p>
      <NumericFormat
        className={cn(
          'text-5xl font-bold w-full text-center outline-none bg-transparent',
          colorByType[type],
          isError && 'text-destructive'
        )}
        getInputRef={inputRef}
        name={field.name}
        value={field.state.value === 0 ? '' : field.state.value}
        onValueChange={({ floatValue }) => field.handleChange(floatValue ?? 0)}
        onBlur={field.handleBlur}
        prefix="$"
        thousandSeparator="."
        decimalSeparator=","
        placeholder="$ 0"
        inputMode="numeric"
        allowNegative={false}
      />
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
