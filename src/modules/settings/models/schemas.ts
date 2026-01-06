import { z } from 'zod';

export const createTokenSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});
