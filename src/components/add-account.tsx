import { LucidePlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Card, CardDescription } from './ui/card';

export function AddAcount() {
  return (
    <Dialog>
      <Card className="items-center rounded-sm">
        <DialogTrigger>
          <button className="h-16 w-16 rounded-full bg-primary-foreground flex transition-all justify-center items-center hover:scale-105">
            <LucidePlus className="text-primary" size={30} strokeWidth={3} />
          </button>
        </DialogTrigger>
        <CardDescription>Agregar cuenta</CardDescription>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva cuenta</DialogTitle>
          <DialogDescription>Crea una nueva cuenta para tus transacciones</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
