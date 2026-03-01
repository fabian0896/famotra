import { useRouter } from '@tanstack/react-router';
import { AccountForm } from '../components/account-form';
import { Content, Header, Page } from '@/components/dashboard-layout';

export function NewAccountPage() {
  const route = useRouter();

  const handleSuccess = () => {
    if (route.history.canGoBack()) {
      return route.history.back();
    }
    return route.navigate({ to: '/dashboard/accounts' });
  };

  return (
    <Page>
      <Header>
        <Header.BackButton />
        <Header.Title>Nueva cuenta</Header.Title>
      </Header>
      <Content>
        <AccountForm onSuccess={handleSuccess} />
      </Content>
    </Page>
  );
}
