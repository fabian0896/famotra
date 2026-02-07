import { AuthLayout } from '@/modules/auth/components/auth-layout';
import { LoginForm } from '@/modules/auth/components/login-form';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
