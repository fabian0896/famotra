import { useEffect, useState } from 'react';
import type { Subscription } from '../models/subscriptions.models';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CreateEditSubscriptionDialog({
  children,
  isOpen,
  subscription,
  onOpenChange,
}: {
  children?: React.ReactNode;
  isOpen?: boolean;
  subscription?: Subscription;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('');
  const handleClose = (state: boolean) => {
    onOpenChange?.(state);
    setOpen(state);
  };
  useEffect(() => {
    if (isOpen === undefined) return;
    setOpen(isOpen);
  }, [isOpen]);
  useEffect(() => {
    if (!subscription) return;
    setTab(subscription.subscription_type);
  }, [subscription]);
  const isEdit = Boolean(subscription);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger type="button" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Tabs value={tab} onValueChange={setTab} defaultValue="expense">
          <DialogHeader className="mb-6">
            <DialogTitle>{isEdit ? 'Editar suscripción' : 'Nueva suscripción'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Edita tu suscripción con los nuevos datos'
                : 'Agrega una nueva suscripción a tu registro financiero.'}
            </DialogDescription>
            <TabsList className="w-full mt-4">
              <TabsTrigger value="preselect">Predeterminada</TabsTrigger>
              <TabsTrigger value="custom">Personalizada</TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value="preselect"></TabsContent>
          <TabsContent value="custom"></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
