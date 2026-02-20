import z, { uuid } from 'zod';

export const CategoryTypeSchema = z.object({
  type: z.union([z.literal('expense'), z.literal('income')]),
});

export const CreateTransactionSchema = z.object({
  amount: z.string().or(z.number()),
  merchant: z.string(),
  card: z.string(),
});

export const CreateTransactionManualSchema = z.object({
  amount: z.number(),
  category_id: z.uuid(),
  account_id: z.uuid(),
  description: z.string().optional(),
  type: z.union([z.literal('expense'), z.literal('income'), z.literal('transfer')]),
  destination_account_id: z.uuid().optional(),
});

export const UpdateTransactionSchema = z.object({
  id: uuid(),
  category_id: uuid().optional(),
  account_id: uuid().optional(),
});
