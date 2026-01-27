import { z } from 'zod';

export const addTransactionsSchema = z.object({
  id: z.union([z.string(), z.undefined()]),
  description: z.string().nonempty({ message: 'La descripción es requedrida' }),
  category_id: z.uuidv4({ message: 'Debe seleccionar una categoría válida' }),
  account_id: z.uuidv4({ message: 'Debe seleccionar una cuenta válida' }),
  amount: z.number().refine((val) => val !== 0, {
    message: 'El monto debe ser diferente de 0',
  }),
  date: z.string(),
});

export const addTransferSchema = addTransactionsSchema.extend({
  destination_account_id: z.uuidv4({ message: 'Debe seleccionar una cuenta válida' }),
  transaction_type: z.literal('transfer'),
  category_id: z.uuidv4().optional(),
});
