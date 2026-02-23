import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { transactionsQueryOptions } from '../query-options/transactions';
import { Content, Header, Page } from '@/components/dashboard-layout';
import { DateSelector } from '@/components/date-selector';

export function TransactionsPage() {
  const { data } = useSuspenseInfiniteQuery(transactionsQueryOptions({ pageSize: 30 }));

  return (
    <Page>
      <Header>
        <Header.Title>Transacciones</Header.Title>
        <Header.Actions>
          <Header.ActionButton>
            <PlusIcon />
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content className="flex flex-col gap-4">
        <DateSelector className="mt-4" />

        <div className="space-x-2">
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            All
          </span>
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            Type
          </span>
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            Account
          </span>
          <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground inline-block">
            Category
          </span>
        </div>

        <div className="bg-card rounded-2xl py-3 px-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-green-400 text-center">+$3.000.000</p>
            <p className="text-[11px] text-center font-medium text-muted-foreground">Income</p>
          </div>
          <div className="h-9 w-px bg-muted"></div>
          <div>
            <p className="text-sm font-bold text-red-400 text-center">-$1.000.000</p>
            <p className="text-[11px] text-center font-medium text-muted-foreground">Expenses</p>
          </div>
          <div className="h-9 w-px bg-muted"></div>
          <div>
            <p className="text-sm font-bold text-blue-400 text-center">$1.500.000</p>
            <p className="text-[11px] text-center font-medium text-muted-foreground">Balance</p>
          </div>
        </div>

        <div>
          <p>Aqui van las transacciones</p>
          {data.transactions.map((t) => (
            <div key={t.id}>{t.description}</div>
          ))}
        </div>
      </Content>
    </Page>
  );
}
