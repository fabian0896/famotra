import { z } from 'zod';

export const bankFormSchema = z.object({
  id: z.union([z.uuid(), z.undefined()]),
  name: z.string().nonempty({ message: 'Debes ingresar un nombre' }),
  logo: z.string().nonempty({ message: 'Debes subir un logo' }),
});
