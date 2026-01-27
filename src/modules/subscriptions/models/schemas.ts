import { z } from 'zod';

export const addSubscriptionsSchema = z.object({
  id: z.union([z.string(), z.undefined()]),
  name: z.string().nonempty({ message: 'El nombre es requerido' }),
  icon: z.string().nonempty({ message: 'El icono es requerido' }),
  start_day: z.string().nonempty({ message: 'La fecha de inicio es requerida' }),
  frequency: z.number().min(1, { message: 'La frecuencia debe ser al menos 1' }),
  account_id: z.uuidv4({ message: 'Debe seleccionar una cuenta válida' }),
  amount: z.number().refine((val) => val !== 0, {
    message: 'El monto debe ser diferente de 0',
  }),
  date: z.string(),
  subscription_type: z.enum(['custom', 'preselect']),
  status: z.enum(['active', 'inactive']).optional(),
});
