import { useSuspenseQuery } from '@tanstack/react-query';
import { banksQueryOptions } from '@/query-options/banks';

export function BanksPage() {
  const { data: banks } = useSuspenseQuery(banksQueryOptions);
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-2">Bancos</h1>
        <p className="text-muted-foreground">
          Gestiona la lista de bancos que los usuarios pueden ver
        </p>
      </header>
      <div>
        {banks.map((bank) => (
          <div key={bank.id}>{bank.name}</div>
        ))}
      </div>
    </div>
  );
}
