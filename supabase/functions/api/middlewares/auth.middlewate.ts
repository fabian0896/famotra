import { factory } from '@/integrations/hono-factory.ts';
import { supabase } from '@/integrations/supabase-client.ts';

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const authorization = c.req.header('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authorization.replace('Bearer ', '');

  const { data: user } = await supabase
    .from('api_tokens')
    .select()
    .eq('id', token)
    .single()
    .throwOnError();

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('userId', user.user_id);
  c.set('token', user);
  await next();
});
