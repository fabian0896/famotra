import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon, SearchIcon, TagIcon } from 'lucide-react';
import type { CategoryTypes } from '@/modules/categories/models/categories.models';
import { useFieldContext } from '@/hooks/form';
import { categoriesQueryOptions } from '@/modules/categories/query-options/categories';
import { InputCard } from '@/components/input-card';
import { FieldError } from '@/components/ui/field';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Spinner } from '@/components/ui/spinner';

export function CategoriesCardField({ label, type }: { label: string; type: CategoryTypes }) {
  const field = useFieldContext<string>();
  const { data, isLoading } = useQuery(categoriesQueryOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const categories = data?.[type] ?? [];
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  const selected = useMemo(
    () => categories.find((c) => c.id === field.state.value) ?? null,
    [field.state.value, categories]
  );

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  );

  return (
    <div className="flex flex-col gap-1.5">
      <InputCard
        className="cursor-pointer"
        data-invalid={isError || undefined}
        onClick={() => setIsOpen(true)}
      >
        <InputCard.Icon>
          {selected ? <span className="text-xl leading-none">{selected.icon}</span> : <TagIcon />}
        </InputCard.Icon>
        <InputCard.Content>
          <InputCard.Label>{label}</InputCard.Label>
          {selected ? (
            <span className="text-foreground font-medium truncate">{selected.name}</span>
          ) : (
            <span className="text-muted-foreground/50 font-medium">Selecciona una categoría</span>
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
              <DrawerTitle className="text-lg font-bold">Seleccionar categoría</DrawerTitle>
              <DrawerDescription className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2.5">
                <SearchIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
                  placeholder="Buscar categorías..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </DrawerDescription>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-6">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 overflow-y-auto px-6 pb-8">
                {filtered.map((category) => {
                  const isSelected = field.state.value === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      data-selected={isSelected || undefined}
                      className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl transition-colors hover:bg-muted data-selected:bg-primary/10 data-selected:ring-1 data-selected:ring-primary/30"
                      onClick={() => {
                        field.handleChange(category.id);
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-2xl leading-none">{category.icon}</span>
                      <span className="text-xs font-medium text-center leading-tight line-clamp-2">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
