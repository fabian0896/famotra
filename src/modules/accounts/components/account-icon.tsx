import { AlertTriangleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ACOUNTS_ICONS } from '../constants/accounts-icons';
import type { ElementType } from 'react';
import type { Account } from '../models/accounts.models';
import type React from 'react';
import type { TransactionAccount } from '@/modules/transactions/models/transactions.models';
import { cn } from '@/lib/utils';

export function AccountIcon({
  account,
  className,
  ...props
}: { account: Account | TransactionAccount | null } & React.ComponentProps<'div'>) {
  if (!account) {
    return <AlertTriangleIcon className="text-amber-600" size={22} />;
  }

  if (account.bank) {
    return (
      <div className={cn('overflow-hidden', className)} {...props}>
        <img
          className="w-full h-full object-cover"
          src={account.bank.logo}
          alt={account.bank.name}
        />
      </div>
    );
  }

  if (!account.custom_bank_icon || !account.custom_bank_name) {
    throw new Error('AccountIcon needs a bank_id or a custom_bank_name and custom_bank_icon');
  }

  const Icon = ACOUNTS_ICONS[account.custom_bank_icon as keyof typeof ACOUNTS_ICONS].Icon;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!Icon) throw new Error('Icon not found');

  return (
    <div
      className={cn('flex items-center justify-center bg-primary/20 text-foreground', className)}
      {...props}
    >
      <Icon className="w-[60%] h-[60%]" />
    </div>
  );
}

export function AccountName<T extends ElementType = 'span'>({
  account,
  as,
  part = 'full',
  ...props
}: {
  part?: 'full' | 'bank' | 'account';
  account: Account | TransactionAccount | null;
  as?: T;
} & React.ComponentProps<T>) {
  const Tag = as ?? 'span';
  const name = useMemo(() => {
    if (!account) return 'Unknown Account';
    if (part === 'bank') return account.bank?.name ?? 'Custom';
    if (part === 'account') return account.name;
    return [account.name, account.bank?.name].filter(Boolean).join(' · ');
  }, [account, part]);
  return <Tag {...props}>{name}</Tag>;
}
