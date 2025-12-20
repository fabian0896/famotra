import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { AmountField } from '@/components/form/amount-field';
import { CategoryField } from '@/components/form/category-field';
import { EmojiField } from '@/components/form/emoji-field';
import { SubmitButton } from '@/components/form/subcribe-button';
import { TextField } from '@/components/form/text-field';
import { DateField } from '@/components/form/date-field';
import { BankField } from '@/components/form/bank-field';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    AmountField,
    EmojiField,
    CategoryField,
    DateField,
    BankField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
