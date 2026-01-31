import Boom from '@hapi/boom';
import type { Context } from '@hono/hono';
import type { ContentfulStatusCode } from '@hono/hono/utils/http-status';

export const errorHandle = (error: unknown, c: Context) => {
  console.error('An error occurred:', error);
  let boom = Boom.internal();

  if (Boom.isBoom(error)) {
    boom = error;
  } else if (error instanceof Error) {
    boom = Boom.internal(error.message);
  }

  const { payload, statusCode } = boom.output;
  return c.json(payload, statusCode as ContentfulStatusCode);
};
