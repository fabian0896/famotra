import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
import { useState } from 'react';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Auth } from '@/modules/auth/services/auth';
import { useAppForm } from '@/hooks/form';
import { InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export function ResetPasswordForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

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
          <Field>
            <form.AppField
              name="confirmPassword"
              children={(field) => (
                <field.TextField label="Confirmar contraseña" type="password">
                  <InputGroupAddon align="inline-start">
                    <LockIcon className="size-5" />
                  </InputGroupAddon>
                </field.TextField>
              )}
            />
            <FieldDescription>Debe tener al menos 8 caracteres.</FieldDescription>
          </Field>
          <Field>
            <form.AppForm>
              <form.SubmitButton>Cambiar contraseña</form.SubmitButton>
            </form.AppForm>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
