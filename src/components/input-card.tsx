import { ArrowUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function InputCardRoot({ className, onClick, ...props }: React.ComponentProps<'div'>) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, label')) return;
    e.currentTarget.querySelector('input')?.focus();
    onClick?.(e);
  };

  return (
    <div
      className={cn(
        'bg-card px-4.5 py-1.5 h-14 rounded-2xl flex gap-3 items-center cursor-text',
        'transition-shadow',
        'has-focus-visible:ring-2 has-focus-visible:ring-primary',
        'data-[invalid=true]:ring-2 data-[invalid=true]:ring-destructive data-[invalid=true]:ring-offset-1',
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

function InputCardIcon({
  className,
  position = 'start',
  ...props
}: { position?: 'start' | 'end' } & React.ComponentProps<'div'>) {
  const pos = position === 'start' ? 'order-first' : 'order-last';
  return (
    <div
      className={cn(
        "[&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-muted-foreground shrink-0 select-none",
        pos,
        className
      )}
      {...props}
    />
  );
}

function InputCardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col flex-1 min-w-0', className)} {...props} />;
}

function InputCardLabel({
  optional = false,
  className,
  children,
  ...props
}: { optional?: boolean } & React.ComponentProps<'label'>) {
  return (
    <label
      className={cn('text-xs font-medium text-muted-foreground cursor-text', className)}
      {...props}
    >
      {children} {optional && <span className="text-muted-foreground/60">(Opcional)</span>}
    </label>
  );
}

function InputCardInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'text-foreground font-medium bg-transparent outline-none w-full truncate',
        'placeholder:text-muted-foreground/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

export function InputGroupCardRoot({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('bg-card rounded-2xl py-2', className)} {...props}>
      {children}
    </div>
  );
}

export function InputCardGroupSeparator() {
  return (
    <div className="flex items-center justify-center -mb-2">
      <div className="flex-1 h-px bg-border"></div>
      <div className="size-9 rounded-full border border-border bg-card grid place-items-center [&_svg]:text-primary [&_svg]:size-4 z-10">
        <ArrowUpDownIcon />
      </div>
      <div className="flex-1 h-px bg-border"></div>
    </div>
  );
}

export const InputGroupCard = Object.assign(InputGroupCardRoot, {
  Separator: InputCardGroupSeparator,
});

export const InputCard = Object.assign(InputCardRoot, {
  Icon: InputCardIcon,
  Content: InputCardContent,
  Label: InputCardLabel,
  Input: InputCardInput,
});
