import { AuthLayout } from '@/modules/auth/components/auth-layout';
import { ResetPasswordForm } from '@/modules/auth/components/reset-password-form';

export function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
