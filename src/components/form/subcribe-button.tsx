import * as React from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { useFormContext } from '@/hooks/form';

export default function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting} {...props}>
          {isSubmitting && <Spinner />}
          {children}
        </Button>
      )}
    />
  );
}
