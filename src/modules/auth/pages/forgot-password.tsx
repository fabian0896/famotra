import { AuthLayout } from '../components/auth-layout';
import { ForgotPasswordForm } from '../components/forgot-password-form';

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar contraseña"
      description="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
