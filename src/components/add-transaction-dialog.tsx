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
import { useAppForm } from '@/hooks/form';

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      description: '',
      category: '',
      account: '',
      amount: 0,
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
              Completa todos los datos para agregar una nueva transaccion
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 mb-6">
            <form.AppField
              name="account"
              children={(field) => <field.TextField label="Cuenta" />}
            />
            <form.AppField
              name="category"
              children={(field) => <field.TextField label="Categoría" />}
            />
            <form.AppField
              name="description"
              children={(field) => <field.TextField label="Descripción" />}
            />
            <form.AppField
              name="amount"
              children={(field) => <field.AmountField label="Valor" />}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Agregar</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
