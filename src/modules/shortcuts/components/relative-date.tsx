import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';

export function RelativeDate({ children }: { children: string }) {
  const value = React.useMemo(() => {
    return formatDistanceToNow(children, { locale: es });
  }, [children]);
  return value;
}
