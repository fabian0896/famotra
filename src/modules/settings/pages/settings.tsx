import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Settingspage() {
  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">Ajustes</h1>
      </header>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="shortcuts">Atajos</TabsTrigger>
          <TabsTrigger value="others">Otros</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <p>Perfil page</p>
        </TabsContent>
        <TabsContent value="shortcuts">
          <p>Contenido de atajos</p>
        </TabsContent>
        <TabsContent value="others">
          <p>Contenido de otros</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
