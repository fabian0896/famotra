import React, { useState } from 'react';
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { format, formatISO, parseISO } from 'date-fns';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { es as datepickerEs } from 'react-day-picker/locale';
import { FieldError } from '../ui/field';
import { InputCard } from '../input-card';
import { Button } from '../ui/button';
import type { ChevronProps } from 'react-day-picker';
import { useFieldContext } from '@/hooks/form';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export function DateField({ label }: { label: string }) {
  const defaultClassNames = getDefaultClassNames();
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date());
  const field = useFieldContext<string | undefined>();

  const dateValue = React.useMemo(() => {
    if (!field.state.value) return 'Seleccionar fecha';
    let value = field.state.value;
    value = value.includes('T') ? value : `${value}T12:00:00`;
    return format(value, 'dd/MM/yyyy', { locale: es });
  }, [field.state.value]);

  const selected = React.useMemo(() => {
    const value = field.state.value;
    if (!value) return undefined;
    return parseISO(value);
  }, [field.state.value]);

  return (
    <div className="flex flex-col gap-1.5">
      <InputCard className="cursor-pointer" onClick={() => setIsOpen(true)}>
        <InputCard.Icon>
          <CalendarIcon />
        </InputCard.Icon>
        <InputCard.Content>
          <InputCard.Label>{label}</InputCard.Label>
          {selected ? (
            <span className="text-foreground font-medium truncate">{dateValue}</span>
          ) : (
            <span className="text-muted-foreground/50 font-medium">Selecciona una fecha</span>
          )}
        </InputCard.Content>
        <InputCard.Icon position="end">
          <ChevronRightIcon className="size-[18px] opacity-70" />
        </InputCard.Icon>
      </InputCard>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerTitle className="sr-only">Selecciona una fecha</DrawerTitle>
          <div className="p-6">
            <DayPicker
              animate
              locale={datepickerEs}
              timeZone="America/Bogota"
              showOutsideDays
              captionLayout="label"
              navLayout="around"
              mode="single"
              weekStartsOn={1}
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={(date) => {
                if (!date) field.setValue(date);
                const value = formatISO(date!);
                field.setValue(value);
              }}
              classNames={{
                root: cn('w-full', defaultClassNames.root),
                months: cn('relative flex flex-col gap-4', defaultClassNames.months),
                month: cn('flex flex-col w-full gap-6', defaultClassNames.month),
                button_previous: cn(
                  'absolute top-0 left-0 z-10 size-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors',
                  defaultClassNames.button_previous
                ),
                button_next: cn(
                  'absolute top-0 right-0 z-10 size-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors',
                  defaultClassNames.button_next
                ),
                month_caption: cn(
                  defaultClassNames.month_caption,
                  'flex items-center justify-center h-9 w-full px-9'
                ),
                caption_label: cn(
                  defaultClassNames.caption_label,
                  'text-base font-semibold text-foreground first-letter:capitalize'
                ),
                month_grid: 'w-full border-collapse',
                weekdays: cn('flex mb-5', defaultClassNames.weekdays),
                weekday: cn(
                  'text-muted-foreground flex-1 text-center font-medium text-sm select-none',
                  defaultClassNames.weekday
                ),
                week: cn('flex w-full mt-2', defaultClassNames.week),
                day: cn(
                  'relative flex-1 aspect-square p-0 flex items-center justify-center select-none',
                  '[&[data-selected]_button]:bg-primary [&[data-selected]_button]:text-primary-foreground',
                  defaultClassNames.day
                ),
                day_button: cn(
                  'size-9 flex items-center justify-center rounded-full text-base font-medium transition-colors hover:bg-muted',
                  defaultClassNames.day_button
                ),
                today: cn('font-bold', defaultClassNames.today),
                disabled: cn('text-muted-foreground opacity-30', defaultClassNames.disabled),
                hidden: cn('invisible', defaultClassNames.hidden),
                outside: cn('text-muted-foreground/40', defaultClassNames.outside),
              }}
              components={{
                CaptionLabel: (props) => {
                  return <DrawerDescription {...props} />;
                },
                Chevron: ({ className, orientation, ...props }: ChevronProps) => {
                  if (orientation === 'left') {
                    return <ChevronLeftIcon className={cn('size-4.5', className)} {...props} />;
                  }

                  if (orientation === 'right') {
                    return <ChevronRightIcon className={cn('size-4.5', className)} {...props} />;
                  }

                  return <ChevronDownIcon className={cn('size-4.5', className)} {...props} />;
                },
              }}
            />
            <div className="pt-5 mt-5 border-t border-border flex gap-3">
              <Button
                onClick={() => {
                  const today = new Date();
                  field.setValue(formatISO(today));
                  setMonth(today);
                }}
                variant="outline"
                className="flex-1 h-11"
              >
                Hoy
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1 h-11">
                Seleccionar
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
