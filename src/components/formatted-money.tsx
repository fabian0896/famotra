import { NumericFormat } from 'react-number-format';

export function FormattedMoney({
  value,
  ...props
}: { value: number; neutral?: boolean } & React.ComponentProps<typeof NumericFormat>) {
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
