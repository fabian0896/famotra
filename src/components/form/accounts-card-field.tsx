import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckIcon, ChevronRightIcon, SearchIcon, WalletIcon } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { useFieldContext } from '@/hooks/form';
import { accountsQueryOptions } from '@/modules/accounts/query-options/accounts';
import { AccountIcon, AccountName } from '@/modules/accounts/components/account-icon';
import { InputCard } from '@/components/input-card';
import { FieldError } from '@/components/ui/field';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Spinner } from '@/components/ui/spinner';

export function AccountsCardField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const { data, isLoading } = useQuery(accountsQueryOptions());
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const accounts = data?.accounts ?? [];
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  const selected = useMemo(
    () => accounts.find((a) => a.id === field.state.value) ?? null,
    [field.state.value, accounts]
  );

  const filtered = useMemo(
    () => accounts.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())),
    [accounts, search]
  );

  useEffect(() => {
    if (isOpen) setSearch('');
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-1.5">
      <InputCard
        className="cursor-pointer"
        data-invalid={isError || undefined}
        onClick={() => setIsOpen(true)}
      >
        <InputCard.Icon position="start">
          {isLoading ? (
            <Spinner />
          ) : selected ? (
            <AccountIcon account={selected} className="size-5 rounded" />
          ) : (
            <WalletIcon />
          )}
        </InputCard.Icon>
        <InputCard.Content>
          <InputCard.Label>{label}</InputCard.Label>
          {selected ? (
            <AccountName
              className="text-foreground font-medium truncate"
              as="span"
              account={selected}
              part="full"
            />
          ) : (
            <span className="text-muted-foreground/50 font-medium">Selecciona una cuenta</span>
          )}
        </InputCard.Content>
        <InputCard.Icon position="end">
          <ChevronRightIcon className="size-[18px] opacity-70" />
        </InputCard.Icon>
      </InputCard>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className="flex flex-col overflow-hidden">
            <div className="px-6 pt-4 pb-3 flex flex-col gap-3">
              <DrawerTitle className="text-lg font-bold">Seleccionar cuenta</DrawerTitle>

              <DrawerDescription className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2.5">
                <SearchIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  className="bg-transparent outline-none flex-1 text-base placeholder:text-muted-foreground"
                  placeholder="Buscar cuentas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </DrawerDescription>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto px-6 pb-8">
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <Spinner />
                </div>
              ) : (
                filtered.map((account) => {
                  const isSelected = field.state.value === account.id;
                  return (
                    <button
                      key={account.id}
                      type="button"
                      data-selected={isSelected || undefined}
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-muted data-selected:bg-primary/10 data-selected:ring-1 data-selected:ring-primary/30"
                      onClick={() => {
                        field.handleChange(account.id);
                        setIsOpen(false);
                      }}
                    >
                      <AccountIcon account={account} className="w-10 h-10 rounded-xl shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium truncate">{account.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {account.bank?.name ?? 'Custom'} ·{' '}
                          <NumericFormat
                            className="font-medium"
                            value={account.balance}
                            displayType="text"
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="$"
                          />
                        </p>
                      </div>
                      {isSelected && <CheckIcon className="w-5 h-5 text-primary shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
