import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { lazy } from 'react';

const TextField = lazy(() => import('@/components/form/text-field'));
const SubmitButton = lazy(() => import('@/components/form/subcribe-button'));

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
