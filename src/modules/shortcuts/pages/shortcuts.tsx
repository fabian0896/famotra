import { Plus } from 'lucide-react';
import { CreateTokenDialog } from '../components/create-token-dialog';
import { TokenTable } from '../components/token-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ShortcutsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-2">Atajos</h1>
        <p className="text-muted-foreground">
          Configura todos los datos para poder usar la api en tus atajos
        </p>
      </header>
      <Separator />
      <div className="mt-8">
        <div className="mb-6 flex gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-foreground text-xl font-medium">Tokens de API</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              Este token de API te permite crear y acceder a diferente información sobre tu cuenta
              desde shortcuts. Asegurate que no se filtre.
            </p>
          </div>
          <CreateTokenDialog>
            <Button>
              <Plus />
              Crear nueva llave
            </Button>
          </CreateTokenDialog>
        </div>
        <TokenTable />
      </div>
    </div>
  );
}
