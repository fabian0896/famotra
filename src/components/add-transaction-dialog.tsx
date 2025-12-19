import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useAppForm } from '@/hooks/form';

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      description: '',
      category: '',
      account: '',
      amount: 0,
      date: new Date(),
    },
    onSubmit: ({ value, formApi }) => {
      console.log({ value });
      setOpen(false);
      formApi.reset();
    },
  });

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger type="button" asChild>
        <Button type="button">
          <Plus />
          Nueva Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader className="mb-6">
            <DialogTitle>Nueva Transacción</DialogTitle>
            <DialogDescription>
              Agrega una nueva transacción a tu registro financiero.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 mb-6">
            <Tabs>
              <TabsList className="w-full">
                <TabsTrigger value="gasto">Gasto</TabsTrigger>
                <TabsTrigger value="ingreso">Ingreso</TabsTrigger>
                <TabsTrigger value="transferencia">Transferencias</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="grid grid-cols-2 gap-6">
              <form.AppField
                name="amount"
                children={(field) => <field.AmountField label="Valor" />}
              />
              <form.AppField
                name="description"
                children={(field) => <field.TextField label="Descripción" />}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <form.AppField
                name="category"
                children={(field) => <field.CategoryField type="expenses" lablel="Categoría" />}
              />
              <form.AppField
                name="account"
                children={(field) => <field.TextField label="Cuenta" />}
              />
            </div>
            <form.AppField name="date" children={(field) => <field.DateField label="Fecha" />} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Agregar Gasto</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
