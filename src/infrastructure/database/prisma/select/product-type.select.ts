import { Prisma } from '@prisma/client';

export const oneProductTypeSelectFields = {
  id: true,
  typeName: true,
  defaultSizes: true,
  metadata: true,
} as const satisfies Prisma.ProductTypeSelect;

export const manyProductTypeSelectFields = oneProductTypeSelectFields;

export type OneProductTypeType = Prisma.ProductTypeGetPayload<{
  select: typeof oneProductTypeSelectFields;
}>;

export type ManyProductType = Prisma.ProductTypeGetPayload<{
  select: typeof manyProductTypeSelectFields;
}>;
