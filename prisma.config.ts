import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import { resolveDatabaseUrl } from './prisma/database-url';

function getDatasourceUrl() {
  return resolveDatabaseUrl(env('DATABASE_URL'));
}

export default defineConfig({
  schema: 'prisma/schema/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node dist/prisma/seed/run.js',
  },
  datasource: {
    url: getDatasourceUrl(),
  },
});
