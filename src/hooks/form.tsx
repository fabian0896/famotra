import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { lazy } from 'react';

const TextField = lazy(() => import('@/components/form/text-field'));
const SubmitButton = lazy(() => import('@/components/form/subcribe-button'));
const AmountField = lazy(() => import('@/components/form/amount-field'));

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    AmountField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
