import { z } from 'zod';

export const addAccountSchema = z
  .object({
    id: z.union([z.string(), z.undefined()]),
    name: z.string().nonempty({ message: 'Debes ingresar un nombre para la cuenta' }),
    balance: z.number().min(0),
    bank_id: z.union([z.string(), z.undefined()]),
    custom_bank_name: z.union([z.string(), z.undefined()]),
    custom_bank_icon: z.union([z.string(), z.undefined()]),
  })
  .refine(
    (data) => {
      if (!data.bank_id) {
        return !!data.custom_bank_name && !!data.custom_bank_icon;
      }
      return true;
    },
    {
      message: 'Debes ingresar el nombre e ícono del banco personalizado',
      path: ['custom_bank_name'],
    }
  );
