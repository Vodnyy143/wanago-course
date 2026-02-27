import { z } from 'zod';

export const EnvSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
