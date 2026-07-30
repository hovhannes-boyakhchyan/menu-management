const SUPPORTED_PROTOCOLS = new Set(['postgresql:', 'postgres:']);
const SUPPORTED_SSL_MODES = new Set(['disable', 'prefer', 'require']);

function assertSupportedProtocol(parsedDatabaseUrl: URL): void {
  if (SUPPORTED_PROTOCOLS.has(parsedDatabaseUrl.protocol)) {
    return;
  }

  throw new Error(
    `Invalid DATABASE_URL protocol "${parsedDatabaseUrl.protocol}". This service uses PostgreSQL. Use a postgresql:// or postgres:// connection string.`,
  );
}

export function usesTls(parsedDatabaseUrl: URL): boolean {
  return (
    SUPPORTED_PROTOCOLS.has(parsedDatabaseUrl.protocol) &&
    ((parsedDatabaseUrl.searchParams.has('sslmode') &&
      parsedDatabaseUrl.searchParams.get('sslmode') !== 'disable') ||
      parsedDatabaseUrl.searchParams.get('ssl') === 'true' ||
      parsedDatabaseUrl.searchParams.get('ssl') === '1' ||
      parsedDatabaseUrl.searchParams.has('sslaccept') ||
      parsedDatabaseUrl.searchParams.has('sslcert') ||
      parsedDatabaseUrl.searchParams.has('sslrootcert') ||
      parsedDatabaseUrl.searchParams.has('sslidentity'))
  );
}

function normalizeSslMode(parsedDatabaseUrl: URL): void {
  const sslMode = parsedDatabaseUrl.searchParams.get('sslmode');
  if (!sslMode) {
    return;
  }

  if (SUPPORTED_SSL_MODES.has(sslMode)) {
    return;
  }

  if (sslMode === 'verify-ca' || sslMode === 'verify-full') {
    parsedDatabaseUrl.searchParams.set('sslmode', 'require');

    if (!parsedDatabaseUrl.searchParams.has('sslaccept')) {
      parsedDatabaseUrl.searchParams.set('sslaccept', 'strict');
    }

    return;
  }

  throw new Error(
    `Invalid PostgreSQL sslmode "${sslMode}". Prisma supports sslmode=disable, prefer, or require.`,
  );
}

export function resolveDatabaseUrl(
  databaseUrl: string | undefined,
  sslRootCertPath = process.env.DATABASE_SSL_ROOT_CERT_PATH ??
    process.env.DATABASE_SSL_CERT_PATH,
): string | undefined {
  if (!databaseUrl) {
    return databaseUrl;
  }

  const parsedDatabaseUrl = new URL(databaseUrl);
  assertSupportedProtocol(parsedDatabaseUrl);
  normalizeSslMode(parsedDatabaseUrl);

  if (!sslRootCertPath) {
    return parsedDatabaseUrl.toString();
  }

  if (
    !usesTls(parsedDatabaseUrl) ||
    parsedDatabaseUrl.searchParams.has('sslrootcert')
  ) {
    return parsedDatabaseUrl.toString();
  }

  if (!parsedDatabaseUrl.searchParams.has('sslmode')) {
    parsedDatabaseUrl.searchParams.set('sslmode', 'require');
  }

  parsedDatabaseUrl.searchParams.set('sslrootcert', sslRootCertPath);

  if (!parsedDatabaseUrl.searchParams.has('sslaccept')) {
    parsedDatabaseUrl.searchParams.set('sslaccept', 'strict');
  }

  return parsedDatabaseUrl.toString();
}
