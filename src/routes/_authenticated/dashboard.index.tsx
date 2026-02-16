import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/modules/home/pages/home';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  beforeLoad: () => ({ breadcrumb: 'Inicio' }),
  component: HomePage,
});
