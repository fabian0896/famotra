import { CalendarIcon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { shortcutsCardsQueryOptions } from '../query-options/shortcuts-cards';
import { ShortcutsCardService } from '../services/shortcuts-cards';
import { CardIcon } from './card-icon';
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

function RelativeDate({ children }: { children: string }) {
  const value = React.useMemo(() => {
    return formatDistanceToNow(children, { locale: es });
  }, [children]);
  return value;
}

function CardRow({ card }: { card: ShortcutCard }) {
  const queryClient = useQueryClient();
  const { data: accounts, isLoading } = useQuery(accountsQueryOptions);

  const update = useMutation({
    mutationFn: ShortcutsCardService.update,
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      const queryKey = shortcutsCardsQueryOptions.queryKey;
      return queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <TableRow key={card.name + card.token}>
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
      <TableCell className="px-4">
        <Select
          onValueChange={(account_id) => update.mutate({ ...card, account_id })}
          value={(update.isPending ? update.variables.account_id : card.account_id) ?? undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? 'Cargando...' : 'Sin cuenta asociada'} />
          </SelectTrigger>
          <SelectContent>
            {accounts?.accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <AccountIcon className="w-4 h-4 rounded-full" account={account} />
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="px-4">
        <div className="flex justify-end">
          <Switch
            onCheckedChange={(checked) => update.mutate({ ...card, active: checked })}
            checked={update.isPending ? update.variables.active : card.active}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function CardsTable() {
  const { data: cards } = useSuspenseQuery(shortcutsCardsQueryOptions);
  return (
    <div className="border rounded-md overflow-hidden">
      <Table className="bg-card">
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="px-4">Tarjeta</TableHead>
            <TableHead className="px-4">Último uso</TableHead>
            <TableHead className="px-4">Cuenta asociada</TableHead>
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
