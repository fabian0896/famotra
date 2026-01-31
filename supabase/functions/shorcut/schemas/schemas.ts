import z from 'zod';

export const CategoryTypeSchema = z.object({
  type: z.union([z.literal('expense'), z.literal('income')]),
});

export const CreateTransactionSchema = z.object({
  amount: z.number().positive(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  category_id: z.string().uuid(),
  account_id: z.string().uuid(),
  type: CategoryTypeSchema,
  description: z.string().max(255).optional(),
});
