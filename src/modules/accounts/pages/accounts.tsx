import { useSuspenseQuery } from '@tanstack/react-query';
import { NumericFormat } from 'react-number-format';
import { WalletIcon } from 'lucide-react';
import { accountsQueryOptions } from '../query-options/accounts';
import { AccountCard } from '../components/account-card';
import { CreateEditAccountDialog } from '../components/create-edit-account';
import { AddAcountCard } from '../components/add-account';

export function AccountsPage() {
  const { data } = useSuspenseQuery(accountsQueryOptions);
  const accounts = data.accounts;
  const totalBalance = data.total;
  const accountCount = accounts.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Cuentas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Controla y administra tus cuentas</p>
        </header>

        {/* Hero balance section */}
        <div className="mb-8 rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <WalletIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Balance total
              </p>
              <p className="text-3xl font-bold tracking-tight">
                <NumericFormat
                  value={totalBalance}
                  prefix="$ "
                  thousandSeparator="."
                  decimalSeparator=","
                  displayType="text"
                />
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex h-5 items-center rounded-md bg-secondary px-1.5 font-medium text-secondary-foreground">
              {accountCount}
            </span>
            <span>{accountCount === 1 ? 'cuenta registrada' : 'cuentas registradas'}</span>
          </div>
        </div>

        {/* Account cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard account={account} key={account.id} />
          ))}
          <CreateEditAccountDialog>
            <AddAcountCard />
          </CreateEditAccountDialog>
        </div>
      </div>
    </div>
  );
}
