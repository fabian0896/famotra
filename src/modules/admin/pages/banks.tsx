import { useSuspenseQuery } from '@tanstack/react-query';
import { AddBankButton } from '../components/add-bank-button';
import { BankCard } from '../components/bank-card';
import { CreateEditBankDialog } from '../components/create-edit-bank-dialog';
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {banks.map((bank) => (
          <BankCard key={bank.id} bank={bank} />
        ))}
        <CreateEditBankDialog>
          <AddBankButton />
        </CreateEditBankDialog>
      </div>
    </div>
  );
}
