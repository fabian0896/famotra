import { Link, useRouter } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/hooks/form';
import { Auth } from '@/modules/auth/services/auth';
import { authQueryOptions } from '@/modules/auth/query-options/auth';

const signupSchema = z
  .object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signup = useMutation({
    mutationFn: Auth.signUp,
    onSuccess: async (response) => {
      const queryKey = authQueryOptions.queryKey;
      await queryClient.invalidateQueries({ queryKey });
      if (!response.session) {
        toast.success('Registro Exitoso', {
          description: 'Valida tu correo para poder ingresar a la plataforma',
        });
      }
      router.navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Algo salió mal, intenta nuevamente');
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await signup.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
          <CardDescription>Completa los datos para crear tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField id="name" name="name" label="Nombre completo" />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    id="email"
                    label="Correo"
                    type="email"
                    placeholder="m@example.com"
                  />
                )}
              />
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <form.AppField
                    name="password"
                    children={(field) => (
                      <field.TextField
                        id="password"
                        name="password"
                        type="password"
                        label="contraseña"
                      />
                    )}
                  />
                  <form.AppField
                    name="confirmPassword"
                    children={(field) => (
                      <field.TextField
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        label="Confirmar contraseña"
                      />
                    )}
                  />
                </Field>
                <FieldDescription>Debe tener al menos 8 caracteres.</FieldDescription>
              </Field>
              <Field>
                <form.AppForm>
                  <form.SubmitButton>Crear Cuenta</form.SubmitButton>
                </form.AppForm>
                <FieldDescription className="text-center">
                  Ya tienes una cuenta? <Link to="/">Ingresar</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
