import { AuthLayout } from '../components/auth-layout';
import { LoginForm } from '../components/login-form';

export function LoginPage() {
  return (
    <AuthLayout description="Maneja tus finanzas de una forma simple y efectiva.">
      <LoginForm />
    </AuthLayout>
  );
}
