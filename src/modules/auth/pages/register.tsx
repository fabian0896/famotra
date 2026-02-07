import { AuthLayout } from '@/modules/auth/components/auth-layout';
import { SignupForm } from '@/modules/auth/components/signup-form';

export function RegisterPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
