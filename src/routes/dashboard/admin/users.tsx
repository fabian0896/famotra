import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/modules/admin/pages/users';
import { usersQueryOptions } from '@/modules/admin/query-options/admin-query-options';

export const Route = createFileRoute('/dashboard/admin/users')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(usersQueryOptions());
  },
  component: UsersPage,
});
