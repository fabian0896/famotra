import { LucidePlus } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';

export function AddAcountCard() {
  return (
    <DialogTrigger asChild>
      <button className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/50 px-5 py-8 transition-all duration-200 hover:border-primary/40 hover:bg-card cursor-pointer min-h-[180px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <LucidePlus className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">Agregar cuenta</span>
      </button>
    </DialogTrigger>
  );
}
