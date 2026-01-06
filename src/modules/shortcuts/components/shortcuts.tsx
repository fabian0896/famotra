import { Plus } from 'lucide-react';
import { TokenTable } from './token-table';
import { CreateTokenDialog } from './create-token-dialog';
import { Button } from '@/components/ui/button';

export function Shortcuts() {
  return (
    <div className="max-w-7xl mx-auto">
      <div>
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
