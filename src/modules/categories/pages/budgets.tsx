import { PlusIcon } from 'lucide-react';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function BudgetsPage() {
  return (
    <Page>
      <Header>
        <Header.Title>Presupuestos</Header.Title>
        <Header.Actions>
          <Header.ActionButton>
            <PlusIcon />
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content>
        <p>Aqui van un resumen de presupuestos</p>
        <p>Pronto 🔥</p>
      </Content>
    </Page>
  );
}
