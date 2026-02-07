import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import { UsersService } from '../services/users.service';
import { usersQueryOptions } from '../query-options/admin-query-options';
import type { UserProfile, UserRole } from '../models/users.models';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatError } from '@/lib/format-error';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { QueryKeys } from '@/constants/query-keys';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  user: 'Usuario',
};

function UserAvatar({ seed, className, ...props }: { seed: string } & React.ComponentProps<'div'>) {
  const src = React.useMemo(() => {
    return createAvatar(initials, { seed }).toDataUri();
  }, [seed]);
  return (
    <div className={cn('rounded-md shadow overflow-hidden', className)} {...props}>
      <img className="w-full h-full" src={src} alt={seed} />
    </div>
  );
}

function UserRow({ user }: { user: UserProfile }) {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => {
      return UsersService.updateRole({ id, role });
    },
    onSuccess: () => {
      toast.success('Rol actualizado correctamente');
    },
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS_LIST] });
    },
  });

  const role = update.isPending ? update.variables.role : user.role;

  return (
    <TableRow>
      <TableCell className="px-4">
        <div className="flex items-center gap-2.5">
          <UserAvatar className="w-9" seed={user.name} />
          <div className="flex-1">
            <p className="font-medium mb-0.5">{user.name}</p>
            <p className="font-mono text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4">{user.email}</TableCell>
      <TableCell className="px-4">
        <Badge variant={role === 'admin' ? 'default' : 'secondary'}>{ROLE_LABELS[role]}</Badge>
      </TableCell>
      <TableCell className="px-4 w-40">
        <Select
          value={role}
          onValueChange={(value: UserRole) => update.mutate({ id: user.id, role: value })}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">Usuario</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}

export function UsersTable({ search, pageSize = 10 }: { search: string; pageSize: number }) {
  const [page, setPage] = useState(1);

  const {
    data: { users, total },
  } = useSuspenseQuery(usersQueryOptions({ search, page, pageSize }));

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (users.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UsersIcon />
          </EmptyMedia>
          <EmptyTitle>Sin usuarios</EmptyTitle>
          <EmptyDescription>
            No se encontraron usuarios que coincidan con tu búsqueda.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table className="bg-card">
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="px-4">Usuario</TableHead>
              <TableHead className="px-4">Correo</TableHead>
              <TableHead className="px-4">Rol</TableHead>
              <TableHead className="px-4 w-40">Cambiar rol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell className="px-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-9 h-9 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4">
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell className="px-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell className="px-4 w-40">
        <Skeleton className="h-8 w-full rounded-md" />
      </TableCell>
    </TableRow>
  );
}

export function UserTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table className="bg-card">
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="px-4">Usuario</TableHead>
            <TableHead className="px-4">Correo</TableHead>
            <TableHead className="px-4">Rol</TableHead>
            <TableHead className="px-4 w-40">Cambiar rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, i) => (
            <SkeletonRow key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
