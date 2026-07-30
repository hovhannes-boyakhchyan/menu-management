import { Prisma } from '@prisma/client';

export const catalogTemplateSelectFields = {
  id: true,
  productTypeId: true,
  name: true,
  description: true,
  imageFileId: true,
  imageUrl: true,
  position: true,
  category: true,
  metadata: true,
} as const satisfies Prisma.CatalogTemplateSelect;

export type CatalogTemplateType = Prisma.CatalogTemplateGetPayload<{
  select: typeof catalogTemplateSelectFields;
}>;
