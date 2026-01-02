import { createFileRoute, redirect } from '@tanstack/react-router';
import { authQueryOptions } from '@/modules/auth/query-options/auth';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const user = await queryClient.fetchQuery(authQueryOptions);
    if (!user) throw redirect({ to: '/' });
  },
});
