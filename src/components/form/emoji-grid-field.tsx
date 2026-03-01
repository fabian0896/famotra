import { EmojiPicker as EmojiPickerPrimitive } from 'frimousse';
import { LoaderIcon } from 'lucide-react';
import { FieldError } from '../ui/field';
import type {
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListEmojiProps,
  EmojiPickerListRowProps,
} from 'frimousse';
import { useFieldContext } from '@/hooks/form';
import { cn } from '@/lib/utils';

function Row({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} className="grid! grid-cols-9">
      {children}
    </div>
  );
}

function Emoji({ emoji, className, ...props }: EmojiPickerListEmojiProps) {
  const field = useFieldContext<string>();
  const isSelected = field.state.value === emoji.emoji;

  return (
    <button
      {...props}
      type="button"
      className={cn(
        'flex-1 aspect-square flex items-center justify-center rounded-lg text-base transition-colors',
        'hover:bg-muted data-active:bg-muted',
        isSelected && 'bg-primary/15 ring-2 ring-inset ring-primary',
        className
      )}
    >
      {emoji.emoji}
    </button>
  );
}

function CategoryHeader({ category, ...props }: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="text-xs text-muted-foreground font-medium pt-3 pb-1.5 first:pt-0 bg-linear-to-b from-card from-65%"
    >
      {category.label}
    </div>
  );
}

export function EmojiGridField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className="group" data-invalid={isError}>
      <p className="text-xs text-muted-foreground font-medium mb-3">{label}</p>
      <div className="bg-card p-4 rounded-2xl border group-data-[invalid=true]:ring-2 group-data-[invalid=true]:ring-destructive group-data-[invalid=true]:ring-offset-1">
        <EmojiPickerPrimitive.Root
          locale="es"
          onEmojiSelect={({ emoji }) => field.handleChange(emoji)}
          className="w-full"
        >
          {/* <EmojiPickerPrimitive.Search
            className="w-full bg-muted/60 rounded-xl px-3 py-2.5 text-base outline-none placeholder:text-muted-foreground mb-3"
            placeholder="Buscar..."
          /> */}
          <EmojiPickerPrimitive.Viewport className="h-[200px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <EmojiPickerPrimitive.Loading className="flex items-center justify-center h-full text-muted-foreground">
              <LoaderIcon className="size-4 animate-spin" />
            </EmojiPickerPrimitive.Loading>
            <EmojiPickerPrimitive.Empty className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No se encontraron emojis.
            </EmojiPickerPrimitive.Empty>
            <EmojiPickerPrimitive.List
              className="select-none"
              components={{ Row, Emoji, CategoryHeader }}
            />
          </EmojiPickerPrimitive.Viewport>
        </EmojiPickerPrimitive.Root>
      </div>
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
