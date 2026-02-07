import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Auth } from '@/modules/auth/services/auth';
import { useAppForm } from '@/hooks/form';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();

  const resetPassword = useMutation({
    mutationFn: ({ password }: { password: string }) => Auth.resetPassword({ password }),
    onSuccess: () => {
      toast.success('Contraseña actualizada correctamente');
      router.navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Algo salió mal, por favor intenta nuevamente');
    },
  });

  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await resetPassword.mutateAsync({ password: value.password });
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Nueva contraseña</CardTitle>
          <CardDescription>Ingresa tu nueva contraseña</CardDescription>
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
                name="password"
                children={(field) => (
                  <field.TextField id="password" type="password" label="Contraseña" />
                )}
              />
              <Field>
                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.TextField
                      id="confirm-password"
                      type="password"
                      label="Confirmar contraseña"
                    />
                  )}
                />
                <FieldDescription>Debe tener al menos 8 caracteres.</FieldDescription>
              </Field>
              <Field>
                <form.AppForm>
                  <form.SubmitButton>Cambiar contraseña</form.SubmitButton>
                </form.AppForm>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
