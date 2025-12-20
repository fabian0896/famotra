import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import type { Account } from '@/models/accounts.models';
import type { User } from '@/models/auth.model';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AccountItemProps = {
  account: Account;
  user: User | null;
};

export function AccountItem({ account, user }: AccountItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <Card className="rounded-sm container relative">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="absolute top-3 right-3 hover:bg-muted rounded-sm">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={2}>
            <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CardTitle className="px-6 items-start">{account.name}</CardTitle>
        <CardContent className="text-center">{account.balance}</CardContent>
        <CardDescription className="px-6">{user?.email}</CardDescription>
      </Card>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cuenta</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar cuenta</DialogTitle>
            <DialogDescription>Estas seguro de eliminar esta cuenta?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
