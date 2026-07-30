import { Prisma } from '@prisma/client';
import { iconSelectFields } from './icon.select';
import { manyProductSelectFields } from './product.select';
import { manyComboSelectFields } from './combo.select';

export const categorySelectFields = {
  id: true,
  locationId: true,
  name: true,
  description: true,
  imageUrl: true,
  position: true,
  icon: { select: iconSelectFields },
} as const satisfies Prisma.CategorySelect;

export type CategoryType = Prisma.CategoryGetPayload<{
  select: typeof categorySelectFields;
}>;

export const categoryWithItemsSelectFields = {
  ...categorySelectFields,
  items: {
    where: {
      OR: [{ product: { deletedAt: null } }, { combo: { deletedAt: null } }],
    },
    orderBy: { position: 'asc' },
    select: {
      product: { select: manyProductSelectFields },
      combo: { select: manyComboSelectFields },
    },
  },
} as const satisfies Prisma.CategorySelect;

export type CategoryWithItemsType = Prisma.CategoryGetPayload<{
  select: typeof categoryWithItemsSelectFields;
}>;

export type CategoryItemWithRefsType = CategoryWithItemsType['items'][number];
