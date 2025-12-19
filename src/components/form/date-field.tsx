import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Field, FieldLabel } from '../ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { useFieldContext } from '@/hooks/form';

export function DateField({ label }: { label: string }) {
  const [open, setOpen] = React.useState(false);
  const field = useFieldContext<Date | undefined>();

  const dateValue = React.useMemo(() => {
    if (!field.state.value) return 'Seleccionar fecha';
    return format(field.state.value, 'dd/MM/yyyy');
  }, [field.state.value]);

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal">
            {dateValue}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            captionLayout="dropdown"
            onSelect={(date) => {
              field.setValue(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
