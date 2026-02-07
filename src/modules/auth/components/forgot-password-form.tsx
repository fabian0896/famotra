import { z } from 'zod';
import { toast } from 'sonner';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Auth } from '@/modules/auth/services/auth';
import { useAppForm } from '@/hooks/form';

const forgotPasswordSchema = z.object({
  email: z.email(),
});

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate();

  const forgotPassword = useMutation({
    mutationFn: ({ email }: { email: string }) => Auth.forgotPassword({ email }),
    onSuccess: () => {
      toast.success('Te enviamos un correo para restablecer tu contraseña');
      navigate({ to: '/' });
    },
    onError: () => {
      toast.error('Algo salió mal, por favor intenta nuevamente');
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await forgotPassword.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="m@gmail.com"
                  />
                )}
              />
              <Field>
                <form.AppForm>
                  <form.SubmitButton>Enviar enlace</form.SubmitButton>
                </form.AppForm>
                <FieldDescription className="text-center">
                  <Link to="/">Volver a iniciar sesión</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
