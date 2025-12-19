import { SmilePlus } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '../ui/emoji-picker';
import { useFieldContext } from '@/hooks/form';

const emojiFieldVariants = cva(
  'w-24 transition-all h-24 rounded-full  mx-auto flex items-center justify-center text-muted-foreground',
  {
    variants: {
      selected: {
        true: 'bg-primary-foreground border border-primary',
        false: 'border border-dashed bg-muted border-muted-foreground',
      },
      error: {
        true: 'bg-red-100 border-red-500 text-red-600',
      },
    },
  }
);

export function EmojiField({ className, ...props }: React.ComponentProps<'button'>) {
  const [isOpen, setIsOpen] = useState(false);
  const field = useFieldContext<string>();
  const emoji = field.state.value;
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          {...props}
          className={emojiFieldVariants({ selected: Boolean(emoji), error: isError, className })}
        >
          {emoji ? (
            <span className="text-4xl">{emoji}</span>
          ) : (
            <SmilePlus className="opacity-50" size={30} />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <EmojiPicker
          locale="es"
          onEmojiSelect={({ emoji: e }) => {
            field.handleChange(e);
            setIsOpen(false);
          }}
          className="h-[342px] shadow-md"
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}
