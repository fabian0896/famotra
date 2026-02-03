import { useSuspenseQuery } from '@tanstack/react-query';
import { usersQueryOptions } from '../query-options/admin-query-options';

export function UsersPage() {
  const { data: users } = useSuspenseQuery(usersQueryOptions);
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-2">Usuarios</h1>
        <p className="text-muted-foreground">
          Revisa y controla todos los usuarios registrados en el sistema
        </p>
      </header>
      <div>
        {users.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </div>
  );
}
