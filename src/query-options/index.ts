import { queryOptions } from "@tanstack/react-query";
import { Auth } from "@/services/auth";

export const authQueryOptions = queryOptions({
  queryKey: ['auth-state'],
  queryFn: () => Auth.getUser(),
  staleTime: Infinity,
  refetchOnWindowFocus: true,
});