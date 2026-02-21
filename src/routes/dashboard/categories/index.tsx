import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { CategoriesPage } from '@/modules/categories/pages/categories';

export const Route = createFileRoute('/dashboard/categories/')({
  validateSearch: z.object({
    type: z.union([z.literal('expense'), z.literal('income')]).optional(),
    date: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
  }),
  component: CategoriesPage,
});
