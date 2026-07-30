import * as fs from 'node:fs';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl, usesTls } from '../../../../prisma/database-url';

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
      // fall through to insecure-but-encrypted
    }
  }

  return { rejectUnauthorized: false };
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    const databaseUrl = config.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }

    const resolved = resolveDatabaseUrl(databaseUrl) ?? databaseUrl;
    process.env.DATABASE_URL = resolved;

    const adapter = new PrismaPg({
      connectionString: stripSslParams(resolved),
      ssl: usesTls(new URL(resolved)) ? buildSslOptions() : false,
      max: 10,
      min: 2,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10_000,
    });

    super({ adapter, log: ['error', 'warn'] });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.$queryRaw`SELECT 1`;
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
