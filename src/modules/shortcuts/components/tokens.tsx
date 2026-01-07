import { Plus } from 'lucide-react';
import { CreateTokenDialog } from './create-token-dialog';
import { SectionHeader } from './section-header';
import { TokenTable } from './token-table';
import { Button } from '@/components/ui/button';

export function Tokens() {
  return (
    <div>
      <div>
        <SectionHeader
          className="mb-6"
          title="Tokens de API"
          desctiption="Este token de API te permite crear y acceder a diferente información sobre tu cuenta
              desde shortcuts. Asegurate que no se filtre."
        >
          <CreateTokenDialog>
            <Button>
              <Plus />
              Crear nueva llave
            </Button>
          </CreateTokenDialog>
        </SectionHeader>
        <TokenTable />
      </div>
    </div>
  );
}
