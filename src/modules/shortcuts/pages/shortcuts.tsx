import { Cards } from '../components/cards';
import { Merchants } from '../components/merchants';
import { Tokens } from '../components/tokens';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ShortcutsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-2">Atajos</h1>
        <p className="text-muted-foreground">
          Configura todos los datos para poder usar la api en tus atajos
        </p>
      </header>
      <Tabs defaultValue="tokens">
        <TabsList className="mb-4">
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="merchants">Comercios</TabsTrigger>
          <TabsTrigger value="pending">Transacciones pendientes</TabsTrigger>
        </TabsList>
        <TabsContent value="tokens">
          <Tokens />
        </TabsContent>
        <TabsContent value="cards">
          <Cards />
        </TabsContent>
        <TabsContent value="merchants">
          <Merchants />
        </TabsContent>
      </Tabs>
    </div>
  );
}
