import { useState } from 'react';
import { Edit2, MoreVertical } from 'lucide-react';
import { CreateEditSubscriptionDialog } from './add-subscription-dialog';
import type { Subscription } from '../models/subscriptions.models';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SubscriptionItem({
  subscription,
  className,
  ...props
}: { subscription: Subscription } & React.ComponentProps<'li'>) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <li className={cn('block', className)} {...props}>
      <Card className="flex flex-row items-center gap-4 p-3 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Edit2 />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
      <CreateEditSubscriptionDialog isOpen={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </li>
  );
}
