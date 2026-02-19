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

export function FormattedMoneyTransaction({
  value,
  transactionType,
  className,
  ...props
}: { value: number; transactionType: TransactionTypes } & React.ComponentProps<
  typeof NumericFormat
>) {
  const signValue = transactionType === 'income' ? `+` : transactionType === 'expense' ? `-` : '';
  return (
    <NumericFormat
      value={Math.abs(value)}
      displayType="text"
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={false}
      prefix={`${signValue}$`}
      className={cn(clx({ type: transactionType }), className)}
      {...props}
    />
  );
}
