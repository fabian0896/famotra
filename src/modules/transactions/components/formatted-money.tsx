import { cva } from 'class-variance-authority';
import { NumericFormat } from 'react-number-format';

const moneyClx = cva('text-base font-medium', {
  variants: {
    isNegative: {
      true: 'text-red-400',
      false: 'text-green-400',
    },
    neutral: {
      true: 'text-foreground!',
      false: '',
    },
  },
});

export function FormattedMoney({
  value,
  neutral,
  className,
  ...props
}: { value: number; neutral?: boolean } & React.ComponentProps<typeof NumericFormat>) {
  const isNegative = value < 0;
  const prefix = isNegative || neutral ? '$' : '+$';
  value = neutral ? Math.abs(value) : value;
  return (
    <NumericFormat
      className={moneyClx({ isNegative, neutral, className })}
      value={value}
      displayType="text"
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={true}
      prefix={prefix}
      {...props}
    />
  );
}
