import { Prisma } from '@prisma/client';

export const modifierSelectFields = {
  id: true,
  templateId: true,
  modifierGroupId: true,
  name: true,
  price: true,
  availability: true,
  availableFrom: true,
  imageFileId: true,
  imageUrl: true,
  tags: true,
} as const satisfies Prisma.ModifierSelect;

export type ModifierType = Prisma.ModifierGetPayload<{
  select: typeof modifierSelectFields;
}>;
