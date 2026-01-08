import { CardsTable } from './cards-table';
import { SectionHeader } from './section-header';

export function Cards() {
  return (
    <div>
      <SectionHeader
        className="mb-6"
        title="Tarjetas usadas en atajos"
        desctiption="Vincula cada tarjeta que se ha usado en tus atajos a una cuenta en el sistema para registrar las transacciones correctamente."
      ></SectionHeader>
      <CardsTable />
    </div>
  );
}
