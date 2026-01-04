import { createFileRoute } from '@tanstack/react-router';
import { Settingspage } from '@/modules/settings/pages/settings';

export const Route = createFileRoute('/_authenticated/dashboard/settings')({
  beforeLoad: () => ({
    breadcrumb: 'Ajustes',
  }),
  component: Settingspage,
});
