import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { format, formatISO, parseISO } from 'date-fns';
import { Field, FieldLabel } from '../ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { useFieldContext } from '@/hooks/form';

export function DateField({ label }: { label: string }) {
  const [open, setOpen] = React.useState(false);
  const field = useFieldContext<string | undefined>();

  const dateValue = React.useMemo(() => {
    if (!field.state.value) return 'Seleccionar fecha';
    let value = field.state.value;
    value = value.includes('T') ? value : `${value}T12:00:00`;
    return format(value, 'dd/MM/yyyy');
  }, [field.state.value]);

  const selected = React.useMemo(() => {
    const value = field.state.value;
    if (!value) return undefined;
    return parseISO(value);
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
            timeZone="America/Bogota"
            mode="single"
            selected={selected}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) field.setValue(date);
              const value = formatISO(date!);
              field.setValue(value);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
