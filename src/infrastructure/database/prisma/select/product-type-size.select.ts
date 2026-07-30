import { Prisma } from '@prisma/client';

export const productTypeSizeSelectFields = {
  id: true,
  locationProductTypeId: true,
  name: true,
  code: true,
  position: true,
} as const satisfies Prisma.ProductTypeSizeSelect;

export type ProductTypeSizeType = Prisma.ProductTypeSizeGetPayload<{
  select: typeof productTypeSizeSelectFields;
}>;
