import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense, useMemo } from 'react';
import { StoreIcon } from 'lucide-react';
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

  return <img src={src} alt={name} className="w-10 h-10 rounded-xl shrink-0" />;
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
    <div className="bg-card rounded-2xl px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <MerchantAvatar name={merchant.name} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm mb-0.5 truncate">{merchant.name}</p>
          <p className="text-muted-foreground text-xs">
            Token <span className="font-semibold">{merchant.token_data.name}</span>
            {' · '}
            <RelativeDate>{merchant.last_used_at}</RelativeDate>
          </p>
        </div>
        <Switch
          onCheckedChange={(checked) => update.mutate({ ...merchant, active: checked })}
          checked={active}
        />
      </div>
      <Suspense fallback={<Skeleton className="w-full h-9" />}>
        <CategorySelect
          onValueChange={(category_id) => update.mutate({ ...merchant, category_id })}
          value={categoryId ?? undefined}
        />
      </Suspense>
    </div>
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
    <div className="space-y-3">
      {merchants.map((merchant) => (
        <MerchantRow key={merchant.name + merchant.token} merchant={merchant} />
      ))}
    </div>
  );
}
