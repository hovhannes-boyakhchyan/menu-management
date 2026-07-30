import { Prisma } from '@prisma/client';

export const catalogProductTypeSelectFields = {
  id: true,
  name: true,
  deletedAt: true,
  productType: { select: { typeName: true } },
} as const satisfies Prisma.LocationProductTypeSelect;

export type CatalogProductTypeRow = Prisma.LocationProductTypeGetPayload<{
  select: typeof catalogProductTypeSelectFields;
}>;

export const catalogProductSelectFields = {
  id: true,
  locationProductTypeId: true,
  name: true,
  imageUrl: true,
  price: true,
  deliveryPrice: true,
  deletedAt: true,
} as const satisfies Prisma.ProductSelect;

export type CatalogProductRow = Prisma.ProductGetPayload<{
  select: typeof catalogProductSelectFields;
}>;

export const catalogComboSelectFields = {
  id: true,
  name: true,
  imageUrl: true,
  price: true,
  deliveryPrice: true,
  deletedAt: true,
} as const satisfies Prisma.ComboSelect;

export type CatalogComboRow = Prisma.ComboGetPayload<{
  select: typeof catalogComboSelectFields;
}>;
