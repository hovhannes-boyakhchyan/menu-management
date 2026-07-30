import { Prisma } from '@prisma/client';
import { productCompactSelectFields } from './product.select';

export const comboSlotChoiceSelectFields = {
  id: true,
  priceDelta: true,
  position: true,
  isDefault: true,
  product: { select: productCompactSelectFields },
} as const satisfies Prisma.ComboSlotChoiceSelect;

export type ComboSlotChoiceType = Prisma.ComboSlotChoiceGetPayload<{
  select: typeof comboSlotChoiceSelectFields;
}>;
