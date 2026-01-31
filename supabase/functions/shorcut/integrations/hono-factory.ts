import { createFactory } from '@hono/hono/factory';
import type { HonoEnv } from '@/models/env.ts';

export const factory = createFactory<HonoEnv>();
