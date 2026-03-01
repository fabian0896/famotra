import '@supabase/functions-js';
import { zValidator } from '@hono/zod-validator';
import { factory } from '@/integrations/hono-factory.ts';
import { authMiddleware } from '@/middlewares/auth.middlewate.ts';
import { supabase } from '@/integrations/supabase-client.ts';
import { errorHandle } from '@/middlewares/error-handle.ts';
import {
  CategoryTypeSchema,
  CreateTransactionManualSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from '@/schemas/schemas.ts';
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
    .select('id, name, bank:bank_list(name)')
    .eq('user_id', userId)
    .throwOnError();
  const accounts = data.map((account) => {
    const bankName = account.bank?.name ?? 'Personalizado';
    return {
      id: account.id,
      name: `${account.name} - ${bankName}`,
    };
  });
  return c.json(accounts);
});

app.post('/transaction', zValidator('json', CreateTransactionSchema), authMiddleware, async (c) => {
  const token = c.var.token;
  const data = c.req.valid('json');

  let card_id: string | null = null;
  let merchant_id: string | null = null;
  let account_id: string | null = null;
  let category_id: string | null = null;
  const amount = parseToNumber(data.amount) * -1;

  if (data.card) {
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

    card_id = card.id ?? null;
    account_id = card.account_id ?? null;
  }

  if (data.merchant) {
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

    merchant_id = merchant.id ?? null;
    category_id = merchant.category_id ?? null;
  }

  const { data: transaction } = await supabase
    .from('transactions')
    .insert({
      amount: amount,
      description: data.merchant ?? 'Atajo vacio 😢',
      account_id: account_id,
      category_id: category_id,
      card_id: card_id,
      merchant_id: merchant_id,
      transaction_type: 'expense',
      user_id: token.user_id,
    })
    .select('id')
    .single()
    .throwOnError();

  return c.json(
    {
      message: 'Transaction created successfully.',
      id: transaction.id,
      category_id: category_id,
      account_id: account_id,
    },
    201
  );
});

app.patch(
  '/transaction',
  zValidator('json', UpdateTransactionSchema),
  authMiddleware,
  async (c) => {
    const data = c.req.valid('json');

    console.log({ data });
    const { data: transaction } = await supabase
      .from('transactions')
      .update({
        category_id: data.category_id || null,
        account_id: data.account_id || null,
      })
      .eq('id', data.id)
      .select()
      .single()
      .throwOnError();

    return c.json(
      {
        message: 'Transaction created successfully.',
        id: transaction.id,
        category_id: transaction.category_id,
        account_id: transaction.account_id,
      },
      200
    );
  }
);

app.post(
  '/manual',
  zValidator('json', CreateTransactionManualSchema),
  authMiddleware,
  async (c) => {
    const token = c.var.token;
    const data = c.req.valid('json');

    const amount = data.type === 'expense' ? data.amount * -1 : data.amount;

    console.log({ data });
    const { data: transaction } = await supabase
      .from('transactions')
      .insert({
        user_id: token.user_id,
        description: data.description || 'Shorcut transaction',
        category_id: data.category_id || null,
        account_id: data.account_id,
        amount: amount,
        transaction_type: data.type,
        destination_account_id: data.destination_account_id || null,
      })
      .select('id')
      .single()
      .throwOnError();

    return c.json({ id: transaction.id });
  }
);

Deno.serve(app.fetch);
