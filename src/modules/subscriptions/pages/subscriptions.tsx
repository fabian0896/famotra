import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { CreateEditSubscriptionDialog } from '../components/add-subscription-dialog';
import { subscriptionsQueryOptions } from '../query-options/subscriptions';
import { SubscriptionList } from '../components/subscriptions-list';
import { SubscriptionItem } from '../components/subscription-item';
import { Button } from '@/components/ui/button';

export function SubscriptionsPage() {
  const {
    data: subscriptions,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(subscriptionsQueryOptions);
  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Suscripciones</h1>
          {subscriptions.length ? (
            <CreateEditSubscriptionDialog>
              <Button type="button">
                <Plus />
                Nueva Suscripción
              </Button>
            </CreateEditSubscriptionDialog>
          ) : null}
        </div>
        <SubscriptionList
          dataLength={subscriptions.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<p className="text-xs text-muted-foreground text-center">Cargando...</p>}
          endMessage={
            <p className="text-xs text-muted-foreground text-center">No hay más suscripciones</p>
          }
        >
          {subscriptions.map((subscription) => (
            <SubscriptionItem key={subscription.id} subscription={subscription} />
          ))}
        </SubscriptionList>
      </div>
    </div>
  );
}
