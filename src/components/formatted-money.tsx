import { NumericFormat } from 'react-number-format';
import type { TransactionTypes } from '@/modules/transactions/models/transactions.models';

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

export function FormattedMoneyTransaction({
  value,
  transactionType,
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
      {...props}
    />
  );
}
