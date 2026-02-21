import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/modules/home/pages/home';

export const Route = createFileRoute('/dashboard/')({
  component: HomePage,
});
