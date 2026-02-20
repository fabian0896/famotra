import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { ElementType } from 'react';
import type React from 'react';

export function LocalDateFormat<T extends ElementType = 'span'>({
  children,
  as,
  formatStr = 'MMMM d, yyyy',
  ...props
}: { children: string; formatStr?: string; as?: T } & React.ComponentProps<T>) {
  const Tag = as ?? 'span';
  const date = useMemo(() => {
    const localDate = `${children}T12:00:00`;
    return format(localDate, formatStr, { locale: es });
  }, [children, formatStr]);
  return <Tag {...props}>{date}</Tag>;
}
