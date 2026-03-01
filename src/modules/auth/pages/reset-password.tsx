import { AuthLayout } from '../components/auth-layout';
import { ResetPasswordForm } from '../components/reset-password-form';

export function ResetPasswordPage() {
  return (
    <AuthLayout title="Nueva contraseña" description="Ingresa tu nueva contraseña.">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
