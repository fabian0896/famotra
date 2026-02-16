import { z } from 'zod';
import { toast } from 'sonner';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { MailIcon } from 'lucide-react';
import { Field, FieldGroup } from '@/components/ui/field';
import { Auth } from '@/modules/auth/services/auth';
import { useAppForm } from '@/hooks/form';
import { InputGroupAddon } from '@/components/ui/input-group';

const forgotPasswordSchema = z.object({
  email: z.email(),
});

export function ForgotPasswordForm() {
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="space-y-4">
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField label="Email" type="email">
                <InputGroupAddon align="inline-start">
                  <MailIcon className="size-5" />
                </InputGroupAddon>
              </field.TextField>
            )}
          />
          <Field>
            <form.AppForm>
              <form.SubmitButton>Enviar enlace</form.SubmitButton>
            </form.AppForm>
          </Field>
        </div>
        <p className="text-sm font-normal text-muted-foreground text-center">
          <Link to="/" className="font-semibold text-primary hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
