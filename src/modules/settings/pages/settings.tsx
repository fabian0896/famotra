import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Settingspage() {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">Ajustes</h1>
      </header>
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="others">Otros</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <p>Perfil page</p>
        </TabsContent>
        <TabsContent value="others">
          <p>Holiwiii</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
