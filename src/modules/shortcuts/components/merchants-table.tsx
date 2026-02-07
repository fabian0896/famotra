import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';
import { CalendarIcon, StoreIcon } from 'lucide-react';
import { toast } from 'sonner';
import { initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { shortcutsMerchantsQueryOptions } from '../query-options/shortcuts-merchants';
import { ShortcutsMerchantService } from '../services/shortcuts-merchants';
import { RelativeDate } from './relative-date';
import type { ShortcutMerchant } from '../models/shorcut-merchants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatError } from '@/lib/format-error';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { categoriesQueryOptions } from '@/modules/categories/query-options/categories';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { QueryKeys } from '@/constants/query-keys';

function MerchantAvatar({ name }: { name: string }) {
  const src = useMemo(() => {
    return createAvatar(initials, { seed: name }).toDataUri();
  }, [name]);

  return <img src={src} alt={name} className="w-8 h-8 rounded-lg" />;
}

function CategorySelect(props: React.ComponentProps<typeof Select>) {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions);
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sin categoria asociada" />
      </SelectTrigger>
      <SelectContent>
        {categories.expense.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.icon} {category.name}
          </SelectItem>
        ))}
        <SelectItem value="NO_CATEGORY">Sin categoria</SelectItem>
      </SelectContent>
    </Select>
  );
}

function MerchantRow({ merchant }: { merchant: ShortcutMerchant }) {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: (data: ShortcutMerchant) => {
      if (data.category_id === 'NO_CATEGORY') {
        data.category_id = null;
      }
      return ShortcutsMerchantService.update(data);
    },
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] });
      return queryClient.invalidateQueries({
        queryKey: shortcutsMerchantsQueryOptions.queryKey,
      });
    },
  });

  const active = update.isPending ? update.variables.active : merchant.active;
  const categoryId = update.isPending ? update.variables.category_id : merchant.category_id;

  return (
    <TableRow>
      <TableCell className="px-4">
        <div className="flex gap-2.5 items-center">
          <MerchantAvatar name={merchant.name} />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm mb-0.5">{merchant.name}</p>
            <p className="text-muted-foreground text-xs">
              Token <span className="font-semibold">{merchant.token_data.name}</span>
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4">
        <div className="flex gap-2 items-center">
          <CalendarIcon className="text-muted-foreground" size={16} />
          <p className="text-sm text-foreground font-medium">
            <RelativeDate>{merchant.last_used_at}</RelativeDate>
          </p>
        </div>
      </TableCell>
      <TableCell className="px-4 w-[200px]">
        <Suspense fallback={<Skeleton className="w-full h-9" />}>
          <CategorySelect
            onValueChange={(category_id) => update.mutate({ ...merchant, category_id })}
            value={categoryId ?? undefined}
          />
        </Suspense>
      </TableCell>
      <TableCell className="px-4">
        <div className="flex justify-end">
          <Switch
            onCheckedChange={(checked) => update.mutate({ ...merchant, active: checked })}
            checked={active}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function MerchantsTable() {
  const { data: merchants } = useSuspenseQuery(shortcutsMerchantsQueryOptions);

  if (merchants.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <StoreIcon />
          </EmptyMedia>
          <EmptyTitle>Sin comercios</EmptyTitle>
          <EmptyDescription>
            Aún no se han registrado comercios desde atajos. Una vez empieces a usar atajos, aquí
            aparecerán.
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
            <TableHead className="px-4">Comerció</TableHead>
            <TableHead className="px-4">Último gasto</TableHead>
            <TableHead className="px-4 w-[200px]">Categoría asociada</TableHead>
            <TableHead className="px-4 text-right">Activo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchants.map((merchant) => (
            <MerchantRow key={merchant.name + merchant.token} merchant={merchant} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
