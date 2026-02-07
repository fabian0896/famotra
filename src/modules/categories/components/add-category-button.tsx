import { LucidePlus } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';

export function AddCategotyButton() {
  return (
    <DialogTrigger asChild>
      <button className="border border-border border-dashed rounded-xl flex items-center justify-center flex-col group transition-all hover:border-primary hover:bg-primary/10 min-h-40">
        <LucidePlus
          className="text-muted-foreground mb-4 group-hover:text-primary"
          size={30}
          strokeWidth={3}
        />
        <span className="text-muted-foreground text-center font-medium text-sm lowercase first-letter:capitalize group-hover:text-primary">
          Agregar categoría
        </span>
      </button>
    </DialogTrigger>
  );
}
