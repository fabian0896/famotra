import { PlusIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { CreateTokenDialog } from '../components/create-token-dialog';
import { TokenTable } from '../components/token-table';
import { CardsTable } from '../components/cards-table';
import { MerchantsTable } from '../components/merchants-table';
import { Content, Footer, Header, Page } from '@/components/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ShortcutsPage({ tab = 'tokens' }: { tab?: string }) {
  const navigate = useNavigate();

  const changeTab = (value: string) => {
    navigate({
      replace: true,
      to: '/dashboard/shortcuts',
      search: { tab: value },
    });
  };

  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Atajos</Header.Title>
        {tab === 'tokens' && (
          <Header.Actions>
            <CreateTokenDialog>
              <Header.ActionButton size="sm">
                <PlusIcon />
              </Header.ActionButton>
            </CreateTokenDialog>
          </Header.Actions>
        )}
      </Header>

      <Content>
        <Tabs value={tab} onValueChange={changeTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="tokens" className="flex-1">
              Tokens
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex-1">
              Tarjetas
            </TabsTrigger>
            <TabsTrigger value="merchants" className="flex-1">
              Comercios
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tokens">
            <TokenTable />
          </TabsContent>
          <TabsContent value="cards">
            <CardsTable />
          </TabsContent>
          <TabsContent value="merchants">
            <MerchantsTable />
          </TabsContent>
        </Tabs>
      </Content>

      <Footer.Hide />
    </Page>
  );
}
