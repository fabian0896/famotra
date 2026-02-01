import z from 'zod';

export const CategoryTypeSchema = z.object({
  type: z.union([z.literal('expense'), z.literal('income')]),
});

export const CreateTransactionSchema = z.object({
  amount: z.string().or(z.number()),
  merchant: z.string(),
  card: z.string(),
});
