import { Prisma } from '@prisma/client';
import { iconSelectFields } from './icon.select';
import { oneProductTypeSelectFields } from './product-type.select';

export const oneLocationProductTypeSelectFields = {
  id: true,
  locationId: true,
  productTypeId: true,
  name: true,
  description: true,
  icon: { select: iconSelectFields },
  icon3d: { select: iconSelectFields },
  position: true,
  productType: { select: { typeName: true } },
} as const satisfies Prisma.LocationProductTypeSelect;

export const manyLocationProductTypeSelectFields =
  oneLocationProductTypeSelectFields;

export type OneLocationProductType = Prisma.LocationProductTypeGetPayload<{
  select: typeof oneLocationProductTypeSelectFields;
}>;

export type ManyLocationProductType = Prisma.LocationProductTypeGetPayload<{
  select: typeof manyLocationProductTypeSelectFields;
}>;

export const oneLocationProductTypeWithProductTypeSelectFields = {
  ...oneLocationProductTypeSelectFields,
  productType: {
    select: oneProductTypeSelectFields,
  },
} as const satisfies Prisma.LocationProductTypeSelect;

export type OneLocationProductTypeWithProductType =
  Prisma.LocationProductTypeGetPayload<{
    select: typeof oneLocationProductTypeWithProductTypeSelectFields;
  }>;

export const manyLocationProductTypeWithProductTypeSelectFields = {
  ...manyLocationProductTypeSelectFields,
  productType: {
    select: oneProductTypeSelectFields,
  },
} as const satisfies Prisma.LocationProductTypeSelect;

export type ManyLocationProductTypeWithProductType =
  Prisma.LocationProductTypeGetPayload<{
    select: typeof manyLocationProductTypeWithProductTypeSelectFields;
  }>;
