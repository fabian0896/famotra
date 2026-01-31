import '@supabase/functions-js';
import { factory } from '@/integrations/hono-factory.ts';
import { authMiddleware } from '@/middlewares/auth.middlewate.ts';
import { supabase } from '@/integrations/supabase-client.ts';
import { errorHandle } from '@/middlewares/error-handle.ts';

const functionName = 'api';
const app = factory.createApp().basePath(`/${functionName}`);

app.get('/hello', (c) => c.text('Hello from hono-server!'));

app.get('/categories', authMiddleware, async (c) => {
  const userId = c.var.userId;
  const { data: categories } = await supabase
    .from('categories')
    .select()
    .eq('user_id', userId)
    .eq('type', 'expense')
    .throwOnError();
  return c.json({ categories });
});

app.get('/accounts', authMiddleware, async (c) => {
  const userId = c.var.userId;
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*, bank:bank_list(id,name,logo)')
    .eq('user_id', userId)
    .throwOnError();
  return c.json({ accounts });
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
