import { LucidePlus } from 'lucide-react';
import { Card, CardDescription } from './ui/card';
import { DialogTrigger } from './ui/dialog';

export function AddAcountCard() {
  return (
    <Card className="items-center rounded-sm">
      <DialogTrigger asChild>
        <div className="h-16 w-16 rounded-full bg-primary-foreground flex transition-all justify-center items-center hover:scale-105">
          <LucidePlus className="text-primary" size={30} strokeWidth={3} />
        </div>
      </DialogTrigger>
      <CardDescription>Agregar cuenta</CardDescription>
    </Card>
  );
}
