import { Link, useRouter } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo } from 'sileo';
import { z } from 'zod';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/hooks/form';
import { Auth } from '@/modules/auth/services/auth';
import { authQueryOptions } from '@/modules/auth/query-options/auth';
import { InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';

const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export function SignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);

  const signup = useMutation({
    mutationFn: Auth.signUp,
    onSuccess: async (response) => {
      const queryKey = authQueryOptions.queryKey;
      await queryClient.invalidateQueries({ queryKey });
      if (!response.session) {
        sileo.success({
          title: 'Registro Exitoso',
          description: 'Valida tu correo para poder ingresar a la plataforma',
        });
      }
      router.navigate({ to: '/dashboard' });
    },
    onError: () => {
      sileo.error({ title: 'Algo salió mal, intenta nuevamente' });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
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
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="space-y-4">
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Nombre completo">
                <InputGroupAddon align="inline-start">
                  <UserIcon className="size-5" />
                </InputGroupAddon>
              </field.TextField>
            )}
          />
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
          <form.AppField
            name="password"
            children={(field) => (
              <field.TextField label="Contraseña" type={showPassword ? 'text' : 'password'}>
                <InputGroupAddon align="inline-start">
                  <LockIcon className="size-5" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeOffIcon className="size-5" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </field.TextField>
            )}
          />
          <Field className="pt-2">
            <form.AppForm>
              <form.SubmitButton>Crear Cuenta</form.SubmitButton>
            </form.AppForm>
          </Field>
        </div>
        <div className="relative h-5 text-sm group-data-[variant=outline]/field-group:-mb-2">
          <Separator className="absolute inset-0 top-1/2" />
          <span className="bg-background text-muted-foreground relative mx-auto block w-fit px-2">
            O continua con
          </span>
        </div>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continuar con Google
          </Button>
        </Field>
        <p className="text-sm font-normal text-muted-foreground text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="font-semibold text-primary hover:underline">
            Ingresar
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
