import { createFileRoute } from '@tanstack/react-router';
import { accountByIdOptions } from '@/modules/accounts/query-options/accounts';
import { EditAccountPage } from '@/modules/accounts/pages/edit-account';

export const Route = createFileRoute('/dashboard/accounts/$id/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(accountByIdOptions(params.id, context.queryClient)),
  component: EditAccountPage,
});
