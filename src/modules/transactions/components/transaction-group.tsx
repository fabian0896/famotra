import { useAutoAnimate } from '@formkit/auto-animate/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';

export function TransactionGroup({ date, children }: { date: string; children: React.ReactNode }) {
  const [parent] = useAutoAnimate();

  const groupName = React.useMemo(() => {
    const localDate = `${date}T12:00:00`;
    return format(localDate, "d 'de' MMMM, yyyy", { locale: es });
  }, [date]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{groupName}</p>
      </div>
      <ul ref={parent} className="space-y-4">
        {children}
      </ul>
    </div>
  );
}
