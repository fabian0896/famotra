import '@supabase/functions-js';
import { factory } from '@/integrations/hono-factory.ts';
import { authMiddleware } from '@/middlewares/auth.middlewate.ts';
import { supabase } from '@/integrations/supabase-client.ts';
import { errorHandle } from '@/middlewares/error-handle.ts';

const functionName = 'api';
const app = factory.createApp().basePath(`/${functionName}`);

app.get('/hello', (c) => c.text('Hello from hono-server!'));

app.get('/categories/:type', authMiddleware, async (c) => {
  const type = c.req.param('type') as 'income' | 'expense';
  const userId = c.var.userId;
  const { data } = await supabase
    .from('categories')
    .select(`id, name, icon`)
    .eq('user_id', userId)
    .eq('type', type)
    .throwOnError();
  const categories = data.map((category) => ({
    id: category.id,
    name: `${category.icon} ${category.name}`,
  }));
  return c.json(categories);
});

app.get('/accounts', authMiddleware, async (c) => {
  const userId = c.var.userId;
  const { data } = await supabase
    .from('accounts')
    .select('id, name, custom_bank_name, bank:bank_list(name)')
    .eq('user_id', userId)
    .throwOnError();
  const accounts = data.map((account) => {
    const bankName = account.bank?.name ?? account.custom_bank_name ?? 'Unknown Bank';
    return {
      id: account.id,
      name: `${account.name} - ${bankName}`,
    };
  });
  return c.json(accounts);
});

app.post('/shorcut', authMiddleware, async (c) => {
  const userId = c.var.userId;
  // TODO: verificar si la cuenta ya existe en shorcut_cards y si no existe, crearla.
  // TODO: ver si el comercio existe para obtener la categoria. Si no existe crearla para que luego puedan settear la categoria luego.
  // TODO: toca crear un trigger para que cuando se asignen uno de los valores (categoria, cuenta) se agregue a las transacciones de forma automatica.
  await supabase.from('api_tokens').select().eq('user_id', userId).throwOnError();
  return c.json({ message: `Preload data for user ${userId}` });
});

app.onError(errorHandle);

Deno.serve(app.fetch);
