import '@supabase/functions-js';
import { zValidator } from '@hono/zod-validator';
import { factory } from '@/integrations/hono-factory.ts';
import { authMiddleware } from '@/middlewares/auth.middlewate.ts';
import { supabase } from '@/integrations/supabase-client.ts';
import { errorHandle } from '@/middlewares/error-handle.ts';
import { CategoryTypeSchema, CreateTransactionSchema } from '@/schemas/schemas.ts';
import { parseToNumber } from '@/utils/parse-to-numbers.ts';

const functionName = 'shorcut';
const app = factory.createApp().basePath(`/${functionName}`);

app.onError(errorHandle);

app.get('/hello', (c) => c.text('Hello from hono-server!'));

app.get('/categories/:type', zValidator('param', CategoryTypeSchema), authMiddleware, async (c) => {
  const { type } = c.req.valid('param');
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

app.post('/automatic', zValidator('json', CreateTransactionSchema), authMiddleware, async (c) => {
  const token = c.var.token;
  const data = c.req.valid('json');

  const { data: card } = await supabase
    .from('shorcut_cards')
    .upsert({
      token: token.id,
      name: data.card,
      user_id: token.user_id,
    })
    .select()
    .single()
    .throwOnError();

  if (!card.active) {
    return c.json({ message: 'Card is inactive, transaction not created.' }, 200);
  }

  const { data: merchant } = await supabase
    .from('shorcuts_merchants')
    .upsert({
      token: token.id,
      name: data.merchant,
      user_id: token.user_id,
    })
    .select()
    .single()
    .throwOnError();

  if (!merchant.active) {
    return c.json({ message: 'Merchant is inactive, transaction not created.' }, 200);
  }

  const account_id = card.account_id;
  const category_id = merchant.category_id;
  const amount = parseToNumber(data.amount);

  // TODO: sino existe la categoria se podría responder con algo para que la la persona lo seleccione.

  // TODO: guardar la transaccion en una tabla de shorcuts_transactions.
  // En caso de tener category_id y account_id asignados, crear la transaccion en la tabla principal de transacciones.

  // TODO: toca crear un trigger para que cuando se asignen uno de los valores (categoria, cuenta) se agregue a las transacciones de forma automatica.

  return c.json({ amount, account_id, category_id }, 201);
});

Deno.serve(app.fetch);
