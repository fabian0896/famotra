import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { NewTransactionPage } from '@/modules/transactions/pages/new-transaction';

export const Route = createFileRoute('/dashboard/transactions/new')({
  validateSearch: z.object({
    type: z.union([z.literal('expense'), z.literal('income'), z.literal('transfer')]).optional(),
  }),
  component: NewTransactionPage,
});
