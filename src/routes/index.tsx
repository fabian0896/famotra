import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '@/modules/auth/pages/login';

export const Route = createFileRoute('/')({
  component: LoginPage,
});
