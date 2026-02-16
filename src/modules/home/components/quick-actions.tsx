import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export function QuickActions({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex gap-3', className)} {...props}>
      {children}
    </div>
  );
}

const actionStyles = cva('size-10 rounded-xl grid place-items-center &_svg]:size-5', {
  variants: {
    variant: {
      income: 'bg-green-500/13 [&_svg]:text-green-500',
      expense: 'bg-red-500/13 [&_svg]:text-red-500',
      transfer: 'bg-blue-500/13 [&_svg]:text-blue-500',
    },
  },
  defaultVariants: {
    variant: 'income',
  },
});

export function QuickActionButton({
  className,
  children,
  label,
  variant,
  ...props
}: {
  label: string;
  variant: VariantProps<typeof actionStyles>['variant'];
} & React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'flex-1 flex flex-col gap-2 items-center justify-center p-4 bg-card rounded-2xl transition-all active:scale-105',
        className
      )}
      {...props}
    >
      <div className={actionStyles({ variant })}>{children}</div>
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
    </button>
  );
}
