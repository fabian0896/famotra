import type React from 'react';
import { cn } from '@/lib/utils';

export function SectionHeader({
  title,
  desctiption,
  children,
  className,
  ...props
}: {
  title: string;
  desctiption: string;
  children?: React.ReactNode;
} & React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex gap-8 items-center', className)} {...props}>
      <div className="flex-1">
        <h3 className="text-foreground text-xl font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-2xl mt-1">{desctiption}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
