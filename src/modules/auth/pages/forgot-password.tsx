import { AuthLayout } from '@/modules/auth/components/auth-layout';
import { ForgotPasswordForm } from '@/modules/auth/components/forgot-password-form';

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
