import { Suspense, useCallback, useState } from 'react';
import { UserTableSkeleton, UsersTable } from '../components/users-table';
import { UsersSearch } from '../components/users-search';

const PAGE_SIZE = 10;

export function UsersPage() {
  const [search, setSearch] = useState('');

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-2">Usuarios</h1>
        <p className="text-muted-foreground">
          Revisa y controla todos los usuarios registrados en el sistema
        </p>
      </header>
      <div className="space-y-4">
        <UsersSearch onSearch={handleSearch} />
        <Suspense fallback={<UserTableSkeleton />}>
          <UsersTable pageSize={PAGE_SIZE} search={search} />
        </Suspense>
      </div>
    </div>
  );
}
