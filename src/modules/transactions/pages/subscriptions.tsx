import { PlusIcon } from 'lucide-react';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function SubscriptionsPage() {
  return (
    <Page>
      <Header>
        <Header.Title>Subscripciones</Header.Title>
        <Header.Actions>
          <Header.ActionButton>
            <PlusIcon />
          </Header.ActionButton>
        </Header.Actions>
      </Header>

      <Content>
        <p>Aqui van las subscripciones</p>
        <p>Pronto 🔥</p>
      </Content>
    </Page>
  );
}
