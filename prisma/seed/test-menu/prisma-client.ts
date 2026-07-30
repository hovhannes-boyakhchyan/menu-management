import * as fs from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl, usesTls } from '../../database-url';

const SSL_QUERY_PARAMS = [
  'sslmode',
  'ssl',
  'sslaccept',
  'sslcert',
  'sslkey',
  'sslrootcert',
  'sslpassword',
  'sslidentity',
];

function stripSslParams(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  for (const param of SSL_QUERY_PARAMS) {
    url.searchParams.delete(param);
  }
  return url.toString();
}

function buildSslOptions():
  | boolean
  | { ca?: string; rejectUnauthorized: boolean } {
  const certPath =
    process.env.DATABASE_SSL_ROOT_CERT_PATH ??
    process.env.DATABASE_SSL_CERT_PATH;

  if (certPath) {
    try {
      return {
        ca: fs.readFileSync(certPath, 'utf8'),
        rejectUnauthorized: true,
      };
    } catch {
      // fall through
    }
  }

  return { rejectUnauthorized: false };
}

export function createSeedPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env before running the seed.',
    );
  }

  const resolved = resolveDatabaseUrl(databaseUrl) ?? databaseUrl;
  process.env.DATABASE_URL = resolved;

  const adapter = new PrismaPg({
    connectionString: stripSslParams(resolved),
    ssl: usesTls(new URL(resolved)) ? buildSslOptions() : false,
  });

  return new PrismaClient({ adapter });
}
