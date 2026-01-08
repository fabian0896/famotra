import { SectionHeader } from './section-header';
import { TokenTable } from './token-table';

export function Merchants() {
  return (
    <div>
      <SectionHeader
        className="mb-6"
        title="Negocios usados en atajos"
        desctiption="Vincula los negocios a una categoría para agilizar el proceso al moento de agregar una transacción desde la API"
      ></SectionHeader>
      <TokenTable />
    </div>
  );
}
