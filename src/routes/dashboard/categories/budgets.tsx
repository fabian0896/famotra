import { createFileRoute } from '@tanstack/react-router';
import { BudgetsPage } from '@/modules/categories/pages/budgets';

export const Route = createFileRoute('/dashboard/categories/budgets')({
  component: BudgetsPage,
});
