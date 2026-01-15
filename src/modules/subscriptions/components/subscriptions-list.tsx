import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DollarSign, Plus } from 'lucide-react';
import { CreateEditSubscriptionDialog } from './add-subscription-dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

export function SubscriptionList({
  children,
  ...props
}: React.ComponentProps<typeof InfiniteScroll>) {
  const count = React.Children.count(children);
  if (!count) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DollarSign />
          </EmptyMedia>
          <EmptyTitle>Sin Suscripciones</EmptyTitle>
          <EmptyDescription>
            ¿Listo para tomar control de tus finanzas? Agrega tu primera suscripción para comenzar a
            seguir tu dinero.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateEditSubscriptionDialog>
            <Button type="button">
              <Plus />
              Nueva Suscripción
            </Button>
          </CreateEditSubscriptionDialog>
        </EmptyContent>
      </Empty>
    );
  }
  <InfiniteScroll {...props} className="flex flex-col gap-6">
    {children}
  </InfiniteScroll>;
}
