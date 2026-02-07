import { MerchantsTable } from './merchants-table';
import { SectionHeader } from './section-header';

export function Merchants() {
  return (
    <div>
      <SectionHeader
        className="mb-6"
        title="Negocios usados en atajos"
        desctiption="Vincula los negocios a una categoría para agilizar el proceso al momento de agregar una transacción desde la API"
      ></SectionHeader>
      <MerchantsTable />
    </div>
  );
}
