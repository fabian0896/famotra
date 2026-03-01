import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftRightIcon,
  CheckIcon,
  LayersIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { DropdownMenu } from 'radix-ui';
import type { TransactionTypes } from '../models/transactions.models';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { categoriesQueryOptions } from '@/modules/categories/query-options/categories';
import { AccountIcon } from '@/modules/accounts/components/account-icon';
import { cn } from '@/lib/utils';

// --- Shared primitives ---

const CONTENT_CLASS =
  'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-card border-none rounded-2xl min-w-[300px] p-2 shadow-md ring-1 duration-100 z-50 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden';

function FilterTrigger({
  label,
  count,
  isActive,
  ...props
}: {
  label: string;
  count: number;
  isActive: boolean;
} & React.ComponentProps<'button'>) {
  return (
    <button
      data-active={isActive || undefined}
      className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-flex items-center gap-1.5 shrink-0 transition-colors data-active:bg-primary/10 data-active:border-primary/40 data-active:text-primary"
      {...props}
    >
      {label}
      {isActive && (
        <span className="size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center leading-none">
          {count}
        </span>
      )}
    </button>
  );
}

function SelectAllItem({ isActive, onSelect }: { isActive: boolean; onSelect: () => void }) {
  return (
    <DropdownMenu.Item
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer outline-none hover:bg-muted transition-colors"
      onSelect={() => {
        onSelect();
      }}
    >
      <div className="size-8 rounded-[10px] bg-muted grid place-items-center shrink-0">
        <LayersIcon className="size-4 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground flex-1">Todas</p>
      <div
        className={cn(
          'size-[22px] rounded-full border-[1.5px] border-border grid place-items-center transition-colors',
          !isActive && 'bg-primary border-primary'
        )}
      >
        {!isActive && <CheckIcon className="size-3 text-primary-foreground" />}
      </div>
    </DropdownMenu.Item>
  );
}

function CheckCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={cn(
        'size-[22px] rounded-full border-[1.5px] border-border grid place-items-center transition-colors shrink-0',
        selected && 'bg-primary border-primary'
      )}
    >
      {selected && <CheckIcon className="size-3 text-primary-foreground" />}
    </div>
  );
}

function useToggle(value: string[], onChange?: (ids: string[]) => void) {
  return (id: string) => {
    if (value.includes(id)) {
      onChange?.(value.filter((v) => v !== id));
    } else {
      onChange?.([...value, id]);
    }
  };
}

// --- AccountFilter ---

export function AccountFilter({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange?: (ids: string[]) => void;
}) {
  const { data } = useQuery(accountsQueryOptions());
  const accounts = data?.accounts ?? [];
  const toggle = useToggle(value, onChange);
  const isActive = value.length > 0;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <FilterTrigger label="Cuentas" count={value.length} isActive={isActive} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={6} className={CONTENT_CLASS}>
          <DropdownMenu.Group className="space-y-0.5">
            <DropdownMenu.Label className="text-sm font-semibold text-muted-foreground px-3 py-1">
              Cuentas
            </DropdownMenu.Label>
            <SelectAllItem isActive={isActive} onSelect={() => onChange?.([])} />
            {accounts.map((account) => {
              const selected = value.includes(account.id);
              return (
                <DropdownMenu.Item
                  key={account.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer outline-none hover:bg-muted transition-colors"
                  onSelect={() => {
                    toggle(account.id);
                  }}
                >
                  <AccountIcon account={account} className="size-8 rounded-[10px] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                    {account.bank && (
                      <p className="text-xs text-muted-foreground truncate">{account.bank.name}</p>
                    )}
                  </div>
                  <CheckCircle selected={selected} />
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// --- TypeFilter ---

const TYPE_OPTIONS: { value: TransactionTypes; label: string; icon: React.ReactNode }[] = [
  { value: 'expense', label: 'Gastos', icon: <TrendingDownIcon className="size-4 text-red-400" /> },
  {
    value: 'income',
    label: 'Ingresos',
    icon: <TrendingUpIcon className="size-4 text-emerald-400" />,
  },
  {
    value: 'transfer',
    label: 'Transferencias',
    icon: <ArrowLeftRightIcon className="size-4 text-blue-400" />,
  },
];

export function TypeFilter({
  value,
  onChange,
}: {
  value?: TransactionTypes;
  onChange?: (type: TransactionTypes | undefined) => void;
}) {
  const isActive = value !== undefined;
  const label = TYPE_OPTIONS.find((o) => o.value === value)?.label ?? 'Tipo';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <FilterTrigger label={label} count={isActive ? 1 : 0} isActive={isActive} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={6} className={CONTENT_CLASS}>
          <DropdownMenu.Group className="space-y-0.5">
            <DropdownMenu.Label className="text-sm font-semibold text-muted-foreground px-3 py-1">
              Tipo
            </DropdownMenu.Label>
            <SelectAllItem isActive={isActive} onSelect={() => onChange?.(undefined)} />
            {TYPE_OPTIONS.map((option) => {
              const selected = value === option.value;
              return (
                <DropdownMenu.Item
                  key={option.value}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer outline-none hover:bg-muted transition-colors"
                  onSelect={() => {
                    onChange?.(selected ? undefined : option.value);
                  }}
                >
                  <div className="size-8 rounded-[10px] bg-muted grid place-items-center shrink-0">
                    {option.icon}
                  </div>
                  <p className="text-sm font-medium text-foreground flex-1">{option.label}</p>
                  <CheckCircle selected={selected} />
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// --- CategoryFilter ---

export function CategoryFilter({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange?: (ids: string[]) => void;
}) {
  const { data } = useQuery(categoriesQueryOptions);
  const toggle = useToggle(value, onChange);
  const isActive = value.length > 0;

  const groups = [
    { label: 'Gastos', items: data?.expense ?? [] },
    { label: 'Ingresos', items: data?.income ?? [] },
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <FilterTrigger label="Categorías" count={value.length} isActive={isActive} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={6} className={CONTENT_CLASS}>
          <div className="p-1 space-y-3">
            <SelectAllItem isActive={isActive} onSelect={() => onChange?.([])} />

            {groups.map(({ label, items }) =>
              items.length === 0 ? null : (
                <DropdownMenu.Group key={label} className="space-y-1.5">
                  <DropdownMenu.Label className="text-xs font-semibold text-muted-foreground px-1">
                    {label}
                  </DropdownMenu.Label>
                  <div className="grid grid-cols-4 gap-1">
                    {items.map((category) => {
                      const selected = value.includes(category.id);
                      return (
                        <DropdownMenu.Item
                          key={category.id}
                          className={cn(
                            'flex flex-col items-center gap-1 py-2 px-1 rounded-xl cursor-pointer outline-none transition-colors hover:bg-muted',
                            selected && 'bg-primary/10 ring-1 ring-primary/30'
                          )}
                          onSelect={() => {
                            toggle(category.id);
                          }}
                        >
                          <span className="text-xl leading-none">{category.icon}</span>
                          <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">
                            {category.name}
                          </span>
                        </DropdownMenu.Item>
                      );
                    })}
                  </div>
                </DropdownMenu.Group>
              )
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// --- FiltersBar ---

export function FiltersBar({
  isAllActive,
  onClearAll,
  children,
}: {
  isAllActive: boolean;
  onClearAll: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full gap-2 flex-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
      <button
        data-active={isAllActive || undefined}
        onClick={onClearAll}
        className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground shrink-0 transition-colors data-active:bg-primary/10 data-active:border-primary/40 data-active:text-primary"
      >
        Todos
      </button>
      {children}
    </div>
  );
}
