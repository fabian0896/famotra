import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function CreateEditSubscriptionDialog({
  children,
  isOpen,
  onOpenChange,
}: {
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleClose = (state: boolean) => {
    onOpenChange?.(state);
    setOpen(state);
  };
  useEffect(() => {
    if (isOpen === undefined) return;
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger type="button" asChild>
        {children}
      </DialogTrigger>
      <DialogContent>hOLI</DialogContent>
    </Dialog>
  );
}
