import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { toast } from 'sonner';
import { shortcutsCardsQueryOptions } from '../query-options/shortcuts-cards';
import { ShortcutsCardService } from '../services/shortcuts-cards';
import { CardIcon } from './card-icon';
import { RelativeDate } from './relative-date';
import type { ShortcutCard } from '../models/shortcut-cards';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AccountIcon } from '@/modules/accounts/components/account-icon';
import { Switch } from '@/components/ui/switch';
import { formatError } from '@/lib/format-error';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { QueryKeys } from '@/constants/query-keys';

function AccountSelect(props: React.ComponentProps<typeof Select>) {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions());
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sin cuenta asociada" />
      </SelectTrigger>
      <SelectContent>
        {accounts.accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            <AccountIcon className="w-4 h-4 rounded-full" account={account} />
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CardRow({ card }: { card: ShortcutCard }) {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ShortcutsCardService.update,
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
      return queryClient.invalidateQueries({
        queryKey: shortcutsCardsQueryOptions.queryKey,
      });
    },
  });

  const active = update.isPending ? update.variables.active : card.active;
  const accountId = update.isPending ? update.variables.account_id : card.account_id;

  return (
    <div className="bg-card rounded-2xl px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <CardIcon height={40} width={40} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm mb-0.5 truncate">{card.name}</p>
          <p className="text-muted-foreground text-xs">
            Token <span className="font-semibold">{card.token_data.name}</span>
            {' · '}
            <RelativeDate>{card.last_used_at}</RelativeDate>
          </p>
        </div>
        <Switch
          onCheckedChange={(checked) => update.mutate({ ...card, active: checked })}
          checked={active}
        />
      </div>
      <Suspense fallback={<Skeleton className="w-full h-9" />}>
        <AccountSelect
          onValueChange={(account_id) => update.mutate({ ...card, account_id })}
          value={accountId ?? undefined}
        />
      </Suspense>
    </div>
  );
}

export function CardsTable() {
  const { data: cards } = useSuspenseQuery(shortcutsCardsQueryOptions);

  if (cards.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CardIcon />
          </EmptyMedia>
          <EmptyTitle>Sin tarjetas</EmptyTitle>
          <EmptyDescription>
            Aún no se han registrado tarjetas desde atajos. Una vez empieces a usar atajos, aquí
            aparecerán
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <CardRow key={card.name + card.token} card={card} />
      ))}
    </div>
  );
}
