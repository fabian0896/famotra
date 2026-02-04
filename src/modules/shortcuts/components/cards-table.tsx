import { CalendarIcon } from 'lucide-react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { toast } from 'sonner';
import { shortcutsCardsQueryOptions } from '../query-options/shortcuts-cards';
import { ShortcutsCardService } from '../services/shortcuts-cards';
import { CardIcon } from './card-icon';
import { RelativeDate } from './relative-date';
import type { ShortcutCard } from '../models/shortcut-cards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
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
    <TableRow>
      <TableCell className="px-4">
        <div className="flex gap-2 items-center">
          <CardIcon height={40} width={40} />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm mb-0.5">{card.name}</p>
            <p className="text-muted-foreground text-xs">
              Token <span className="font-semibold">{card.token_data.name}</span>
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4">
        <div className="flex gap-2 items-center">
          <CalendarIcon className="text-muted-foreground" size={16} />
          <p className="text-sm text-foreground font-medium">
            <RelativeDate>{card.last_used_at}</RelativeDate>
          </p>
        </div>
      </TableCell>
      <TableCell className="px-4 w-[200px]">
        <Suspense fallback={<Skeleton className="w-full h-9" />}>
          <AccountSelect
            onValueChange={(account_id) => update.mutate({ ...card, account_id })}
            value={accountId ?? undefined}
          />
        </Suspense>
      </TableCell>
      <TableCell className="px-4">
        <div className="flex justify-end">
          <Switch
            onCheckedChange={(checked) => update.mutate({ ...card, active: checked })}
            checked={active}
          />
        </div>
      </TableCell>
    </TableRow>
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
    <div className="border rounded-md overflow-hidden">
      <Table className="bg-card">
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="px-4">Tarjeta</TableHead>
            <TableHead className="px-4">Último uso</TableHead>
            <TableHead className="px-4 w-[200px]">Cuenta asociada</TableHead>
            <TableHead className="px-4 text-right">Activa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <CardRow key={card.name + card.token} card={card} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
