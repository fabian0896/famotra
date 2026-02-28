import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BuildingIcon, CheckIcon, ChevronRightIcon, PaletteIcon, SearchIcon } from 'lucide-react';
import { useFieldContext } from '@/hooks/form';
import { banksQueryOptions } from '@/query-options/banks';
import { InputCard } from '@/components/input-card';
import { FieldError } from '@/components/ui/field';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Spinner } from '@/components/ui/spinner';

const CUSTOM_VALUE = '';

export function BankField({
  label,
  allowCustom,
  children,
}: {
  label: string;
  allowCustom?: boolean;
  children?: React.ReactNode;
}) {
  const field = useFieldContext<string>();
  const { data, isLoading } = useQuery(banksQueryOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const banks = data ?? [];
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;
  const isCustom = allowCustom && field.state.value === CUSTOM_VALUE;

  const selected = useMemo(
    () => banks.find((b) => b.id === field.state.value) ?? null,
    [field.state.value, banks]
  );

  const filtered = useMemo(
    () => banks.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [banks, search]
  );

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
          ) : isCustom ? (
            <PaletteIcon />
          ) : selected ? (
            <img src={selected.logo} alt={selected.name} className="size-5 rounded-full object-cover" />
          ) : (
            <BuildingIcon />
          )}
        </InputCard.Icon>
        <InputCard.Content>
          <InputCard.Label>{label}</InputCard.Label>
          {isCustom ? (
            <span className="text-foreground font-medium">Cuenta personalizada</span>
          ) : selected ? (
            <span className="text-foreground font-medium truncate">{selected.name}</span>
          ) : (
            <span className="text-muted-foreground/50 font-medium">Selecciona un banco</span>
          )}
        </InputCard.Content>
        <InputCard.Icon position="end">
          <ChevronRightIcon className="size-[18px] opacity-70" />
        </InputCard.Icon>
      </InputCard>

      {isCustom && children}

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className="flex flex-col overflow-hidden">
            <div className="px-6 pt-4 pb-3 flex flex-col gap-3">
              <DrawerTitle className="text-lg font-bold">Seleccionar banco</DrawerTitle>

              <DrawerDescription className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2.5">
                <SearchIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
                  placeholder="Buscar bancos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </DrawerDescription>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto px-6 pb-8">
              {allowCustom && !search && (
                <button
                  type="button"
                  data-selected={isCustom || undefined}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-muted data-selected:bg-primary/10 data-selected:ring-1 data-selected:ring-primary/30"
                  onClick={() => {
                    field.handleChange(CUSTOM_VALUE);
                    setIsOpen(false);
                  }}
                >
                  <div className="size-10 rounded-xl bg-muted grid place-items-center shrink-0">
                    <PaletteIcon className="size-5 text-muted-foreground" />
                  </div>
                  <p className="flex-1 text-left font-medium">Cuenta personalizada</p>
                  {isCustom && <CheckIcon className="size-5 text-primary shrink-0" />}
                </button>
              )}

              {isLoading ? (
                <div className="flex justify-center p-6">
                  <Spinner />
                </div>
              ) : (
                filtered.map((bank) => {
                  const isSelected = field.state.value === bank.id;
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      data-selected={isSelected || undefined}
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-muted data-selected:bg-primary/10 data-selected:ring-1 data-selected:ring-primary/30"
                      onClick={() => {
                        field.handleChange(bank.id);
                        setIsOpen(false);
                      }}
                    >
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="size-10 rounded-xl shrink-0 object-cover"
                      />
                      <p className="flex-1 text-left font-medium truncate">{bank.name}</p>
                      {isSelected && <CheckIcon className="size-5 text-primary shrink-0" />}
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
