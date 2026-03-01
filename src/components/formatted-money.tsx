import { NumericFormat } from 'react-number-format';
import { tv } from 'tailwind-variants';
import type { TransactionTypes } from '@/modules/transactions/models/transactions.models';
import { cn } from '@/lib/utils';

export function FormattedMoney({
  value,
  ...props
}: { value: number; sign?: boolean } & React.ComponentProps<typeof NumericFormat>) {
  return (
    <NumericFormat
      value={value}
      displayType="text"
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={true}
      prefix="$"
      {...props}
    />
  );
}

const clx = tv({
  base: '',
  variants: {
    type: {
      income: 'text-green-400',
      expense: 'text-red-400',
      transfer: 'text-blue-400',
    },
  },
});

const TYPE = {
  '+': 'income',
  '-': 'expense',
  '': 'transfer',
} as const;

export function FormattedMoneyTransaction({
  transactionType,
  className,
  children,
  ...props
}: { value?: number; transactionType?: TransactionTypes; children: number } & React.ComponentProps<
  typeof NumericFormat
>) {
  const value = children;
  const isNeutra = transactionType === 'transfer' || value === 0;
  let signValue = value > 0 ? `+` : value < 0 ? `-` : '';
  signValue = isNeutra ? '' : signValue;

  const type = TYPE[signValue as keyof typeof TYPE];

  return (
    <NumericFormat
      value={Math.abs(value)}
      displayType="text"
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={false}
      prefix={`${signValue}$`}
      className={cn(clx({ type: type }), className)}
      {...props}
    />
  );
}
