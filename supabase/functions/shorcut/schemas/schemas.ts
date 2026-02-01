import z, { uuid } from 'zod';

export const CategoryTypeSchema = z.object({
  type: z.union([z.literal('expense'), z.literal('income')]),
});

export const CreateTransactionSchema = z.object({
  amount: z.string().or(z.number()),
  merchant: z.string(),
  card: z.string(),
});

export const UpdateTransactionSchema = z.object({
  id: uuid(),
  category_id: uuid().optional(),
  account_id: uuid().optional(),
});
