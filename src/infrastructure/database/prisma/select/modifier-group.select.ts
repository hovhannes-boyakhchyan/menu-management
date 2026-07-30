import { Prisma } from '@prisma/client';
import { modifierSelectFields } from './modifier.select';

export const modifierGroupSelectFields = {
  id: true,
  productId: true,
  name: true,
  position: true,
  minSelect: true,
  maxSelect: true,
  allowDuplicateModifiers: true,
  fixedPriceLimit: true,
  fixedPrice: true,
  isSliceable: true,
  modifiers: { select: modifierSelectFields },
} as const satisfies Prisma.ModifierGroupSelect;

export type ModifierGroupType = Prisma.ModifierGroupGetPayload<{
  select: typeof modifierGroupSelectFields;
}>;

export const productModifierGroupsArgs = {
  select: modifierGroupSelectFields,
  orderBy: { position: 'asc' },
} as const satisfies Prisma.Product$modifierGroupsArgs;
