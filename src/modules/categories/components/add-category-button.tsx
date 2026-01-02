import { LucidePlus } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';

export function AddCategotyButton() {
  return (
    <DialogTrigger asChild>
      <button className="flex flex-col justify-center items-center gap-1.5 group">
        <div className="bg-primary/20 rounded-full w-16 h-16 text-2xl flex items-center justify-center">
          <span className="group-hover:scale-110 group-hover:rotate-12 transition-all">
            <LucidePlus className="text-primary" size={30} strokeWidth={3} />
          </span>
        </div>
        <span className="text-muted-foreground text-center font-medium text-sm lowercase first-letter:capitalize group-hover:text-foreground">
          Agregar
        </span>
      </button>
    </DialogTrigger>
  );
}
