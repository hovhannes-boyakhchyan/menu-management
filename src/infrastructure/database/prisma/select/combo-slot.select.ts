import { Prisma } from '@prisma/client';
import { iconSelectFields } from './icon.select';
import { comboSlotChoiceSelectFields } from './combo-slot-choice.select';

export const comboSlotSelectFields = {
  id: true,
  title: true,
  position: true,
  minSelect: true,
  maxSelect: true,
  allowedType: {
    select: {
      id: true,
      name: true,
      icon: { select: iconSelectFields },
      icon3d: { select: iconSelectFields },
      productType: { select: { typeName: true } },
    },
  },
  choices: {
    select: comboSlotChoiceSelectFields,
    where: { product: { deletedAt: null } },
    orderBy: { position: 'asc' },
  },
} as const satisfies Prisma.ComboSlotSelect;

export type ComboSlotType = Prisma.ComboSlotGetPayload<{
  select: typeof comboSlotSelectFields;
}>;

export const comboSlotAvailabilitySelectFields = {
  minSelect: true,
  choices: {
    where: { product: { deletedAt: null } },
    select: {
      product: {
        select: {
          availability: true,
          availableFrom: true,
          modifierGroups: {
            select: {
              minSelect: true,
              modifiers: {
                select: {
                  availability: true,
                  availableFrom: true,
                  templateId: true,
                },
              },
            },
          },
        },
      },
    },
  },
} as const satisfies Prisma.ComboSlotSelect;
