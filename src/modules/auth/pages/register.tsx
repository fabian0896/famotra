import { AuthLayout } from '../components/auth-layout';
import { SignupForm } from '../components/signup-form';

export function RegisterPage() {
  return (
    <AuthLayout title="Crea tu cuenta" description="Completa los datos para crear tu cuenta.">
      <SignupForm />
    </AuthLayout>
  );
}
