import { z } from 'zod';

export const addCategorySchema = z.object({
  id: z.union([z.uuidv4(), z.undefined()]),
  name: z.string().nonempty({ message: 'Debes ingresar un nombre para la categoría' }),
  icon: z.emoji(),
  type: z.enum(['income', 'expense']),
});
