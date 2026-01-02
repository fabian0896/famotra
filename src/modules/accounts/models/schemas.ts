import { z } from 'zod';

export const addAccountSchema = z.object({
  name: z.string().nonempty({ message: 'Debes ingresar un nombre para la cuenta' }),
  bank_id: z.string().nonempty({ message: 'Debes escoger un banco' }),
  balance: z.number().min(0),
});
