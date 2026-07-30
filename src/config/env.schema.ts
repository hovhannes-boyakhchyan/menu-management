import { z } from 'zod';
import { ENV } from './env';

export const EnvSchema = z.object({
  // App
  NODE_ENV: z.enum(ENV).default('dev'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  // Database
  DATABASE_URL: z.url(),
  OLD_DATABASE_URL: z.url().optional(),
  // ImageKit
  IMAGEKIT_PRIVATE_KEY: z.string(),
});

export type EnvVars = z.infer<typeof EnvSchema>;

export function validateEnv(env: Record<string, unknown>): EnvVars {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid environment variables: ${message}`);
  }
  return parsed.data;
}
