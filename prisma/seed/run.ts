import 'dotenv/config';
import * as fs from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { IconType, Prisma, PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl, usesTls } from '../database-url';
import { PRODUCT_TYPES } from './data/product-types';
import { PIZZA_TEMPLATES } from './data/pizzas';
import { TOPPING_TEMPLATES } from './data/toppings';
import { DRINK_TEMPLATES } from './data/drinks';
import { ICONS } from './data/icons';
import { ICONS_3D } from './data/icons-3d';

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

const prisma = new PrismaClient({ adapter });

async function seedProductTypes(): Promise<Map<string, string>> {
  const idByName = new Map<string, string>();

  for (const seed of PRODUCT_TYPES) {
    const defaultSizes =
      seed.defaultSizes == null
        ? Prisma.JsonNull
        : (seed.defaultSizes as Prisma.InputJsonValue);
    const productType = await prisma.productType.upsert({
      where: { typeName: seed.typeName },
      update: { defaultSizes },
      create: { typeName: seed.typeName, defaultSizes },
      select: { id: true, typeName: true },
    });
    idByName.set(productType.typeName, productType.id);
  }

  console.log(`Seeded ${idByName.size} product types`);
  return idByName;
}

async function seedPizzaTemplates(productTypeId: string): Promise<void> {
  for (const pizza of PIZZA_TEMPLATES) {
    await prisma.catalogTemplate.upsert({
      where: {
        productTypeId_name: { productTypeId, name: pizza.name },
      },
      update: {
        position: pizza.position,
        metadata: pizza.metadata,
        imageFileId: pizza.imageFileId,
        imageUrl: pizza.imageUrl,
      },
      create: {
        productTypeId,
        name: pizza.name,
        position: pizza.position,
        metadata: pizza.metadata,
        imageFileId: pizza.imageFileId,
        imageUrl: pizza.imageUrl,
      },
    });
  }
  console.log(`Seeded ${PIZZA_TEMPLATES.length} pizza templates`);
}

async function seedToppingTemplates(productTypeId: string): Promise<void> {
  for (const topping of TOPPING_TEMPLATES) {
    await prisma.catalogTemplate.upsert({
      where: {
        productTypeId_name: { productTypeId, name: topping.name },
      },
      update: {
        category: topping.category,
        position: topping.position,
        metadata: topping.metadata,
        imageFileId: topping.imageFileId,
        imageUrl: topping.imageUrl,
      },
      create: {
        productTypeId,
        name: topping.name,
        category: topping.category,
        position: topping.position,
        metadata: topping.metadata,
        imageFileId: topping.imageFileId,
        imageUrl: topping.imageUrl,
      },
    });
  }
  console.log(`Seeded ${TOPPING_TEMPLATES.length} topping templates`);
}

async function seedDrinkTemplates(productTypeId: string): Promise<void> {
  for (const drink of DRINK_TEMPLATES) {
    await prisma.catalogTemplate.upsert({
      where: {
        productTypeId_name: { productTypeId, name: drink.name },
      },
      update: {
        description: drink.description ?? Prisma.JsonNull,
        position: drink.position,
        imageFileId: drink.imageFileId,
        imageUrl: drink.imageUrl,
      },
      create: {
        productTypeId,
        name: drink.name,
        description: drink.description ?? Prisma.JsonNull,
        position: drink.position,
        imageFileId: drink.imageFileId,
        imageUrl: drink.imageUrl,
      },
    });
  }
  console.log(`Seeded ${DRINK_TEMPLATES.length} drink templates`);
}

async function seedIcons(): Promise<void> {
  const icons = [
    ...ICONS.map((icon) => ({ ...icon, type: IconType.simple })),
    ...ICONS_3D.map((icon) => ({ ...icon, type: IconType.three_d })),
  ];
  for (const icon of icons) {
    const { name, type, imageFileId, imageUrl } = icon;
    await prisma.icon.upsert({
      where: { name_type: { name, type } },
      update: { imageFileId, imageUrl },
      create: { name, type, imageFileId, imageUrl },
    });
  }
  console.log(`Seeded ${icons.length} icons`);
}

async function main() {
  console.log('Seeding database...');

  await seedIcons();

  const productTypeIds = await seedProductTypes();

  const pizzaTypeId = productTypeIds.get('pizza');
  const toppingTypeId = productTypeIds.get('topping');
  const drinkTypeId = productTypeIds.get('drink');

  if (!pizzaTypeId || !toppingTypeId || !drinkTypeId) {
    throw new Error(
      'Required product types (pizza, topping, drink) were not seeded.',
    );
  }

  await seedPizzaTemplates(pizzaTypeId);
  await seedToppingTemplates(toppingTypeId);
  await seedDrinkTemplates(drinkTypeId);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
