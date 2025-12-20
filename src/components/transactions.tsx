import { NumericFormat } from 'react-number-format';
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cva } from 'class-variance-authority';
import type { Transaction } from '@/models/transactions.models';

const moneyClx = cva('text-base font-medium', {
  variants: {
    isNegative: {
      true: 'text-red-400',
      false: 'text-green-400',
    },
  },
});

function FormattedMoney({ value }: { value: number }) {
  const isNegative = value < 0;
  return (
    <NumericFormat
      className={moneyClx({ isNegative })}
      value={value}
      displayType="text"
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={true}
      prefix={isNegative ? '$' : '+$'}
    />
  );
}

export function TransactionList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

export function TransactionGroup({ date, children }: { date: string; children: React.ReactNode }) {
  const [parent] = useAutoAnimate();
  const groupName = React.useMemo(() => {
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
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

export function Transaction({ transaction }: { transaction: Transaction }) {
  return (
    <li className="flex items-center gap-4 px-3 py-2 rounded-lg">
      <div className="text-base flex items-center justify-center bg-primary/20 w-12 h-12 rounded-full">
        {transaction.category.icon}
      </div>
      <div className="flex-1">
        <p className="text-foreground font-medium mb-1">{transaction.description}</p>
        <p className="text-sm text-muted-foreground">{transaction.category.name}</p>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <img
          src={transaction.account.bank?.logo}
          alt={transaction.account.bank?.name}
          className="w-6 h-6 rounded"
        />
        <div>
          <p className="text-sm text-muted-foreground font-medium">{transaction.account.name}</p>
          <p className="text-xs text-muted-foreground">{transaction.account.bank?.name}</p>
        </div>
      </div>
      <div>
        <FormattedMoney value={transaction.amount} />
      </div>
    </li>
  );
}
