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

function InputCardIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('[&_svg]:size-5 [&_svg]:text-muted-foreground shrink-0 select-none', className)}
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

export const InputCard = Object.assign(InputCardRoot, {
  Icon: InputCardIcon,
  Content: InputCardContent,
  Label: InputCardLabel,
  Input: InputCardInput,
});
