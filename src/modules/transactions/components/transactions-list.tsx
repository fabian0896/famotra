import React from 'react';
import { DollarSign, Plus } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../../components/ui/empty';
import { Button } from '../../../components/ui/button';
import { CreateEditTransactionDialog } from './add-transaction-dialog';

export function TransactionList({
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
          <EmptyTitle>Sin Transacciones</EmptyTitle>
          <EmptyDescription>
            ¿Listo para tomar control de tus finanzas? Agrega tu primera transacción para comenzar a
            seguir tu dinero.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateEditTransactionDialog>
            <Button type="button">
              <Plus />
              Nueva Transacción
            </Button>
          </CreateEditTransactionDialog>
        </EmptyContent>
      </Empty>
    );
  }
  // return <div className="flex flex-col gap-6">{children}</div>;
  return (
    <InfiniteScroll {...props} className="flex flex-col gap-6">
      {children}
    </InfiniteScroll>
  );
}
