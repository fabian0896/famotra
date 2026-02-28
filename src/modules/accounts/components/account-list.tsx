import { useSuspenseQuery } from '@tanstack/react-query';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { accountsQueryOptions } from '../query-options/accounts';
import { AccountIcon } from './account-icon';
import { DeleteAccountDialog } from './delete-account-dialog';
import type { Account } from '../models/accounts.models';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';
import { Swipeable } from '@/components/swipeable';

export function AccountListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div>
      <Skeleton className="h-6 w-32 mb-3" />
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 bg-card rounded-2xl flex items-center gap-3.5">
            <Skeleton className="size-12 rounded-2xl shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountItem({ account }: { account: Account }) {
  return (
    <Swipeable>
      <Swipeable.Item>
        <button
          key={account.id}
          className="w-full text-left p-4 bg-card rounded-2xl flex items-center gap-3.5 data-[dragging=true]:rounded-r-none"
        >
          <AccountIcon className="size-12 rounded-2xl" account={account} />
          <div className="flex-1 flex flex-col">
            <p className="text-base font-bold text-foreground mb-0.5">{account.name}</p>
            <p className="text-sm font-normal text-muted-foreground">
              {account.bank?.name ?? 'Personalizada'}
            </p>
          </div>
          <FormattedMoneyTransaction className="text-base font-bold">
            {account.balance}
          </FormattedMoneyTransaction>
        </button>
      </Swipeable.Item>
      <Swipeable.Actions>
        <Swipeable.Action asChild className="bg-primary text-primary-foreground">
          <Link to="/dashboard/accounts/$id/edit" params={{ id: account.id }}>
            <Edit2Icon className="size-5 mb-1" />
            <span className="font-semibold text-[11px]">Editar</span>
          </Link>
        </Swipeable.Action>
        <DeleteAccountDialog accountId={account.id} accountName={account.name}>
          <Swipeable.Action className="bg-red-400 text-red-50 rounded-r-2xl">
            <Trash2Icon className="size-5 mb-1" />
            <span className="font-semibold text-[11px]">Borrar</span>
          </Swipeable.Action>
        </DeleteAccountDialog>
      </Swipeable.Actions>
    </Swipeable>
  );
}

export function AccountList() {
  const {
    data: { accounts },
  } = useSuspenseQuery(accountsQueryOptions());
  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-3">Tus cuentas</h1>
      <div className="space-y-3">
        {accounts.map((account) => (
          <AccountItem key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
