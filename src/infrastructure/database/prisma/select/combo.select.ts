import { Prisma } from '@prisma/client';
import {
  comboSlotSelectFields,
  comboSlotAvailabilitySelectFields,
} from './combo-slot.select';

export const comboSelectFields = {
  id: true,
  locationId: true,
  folderId: true,
  name: true,
  description: true,
  imageFileId: true,
  imageUrl: true,
  kitchenId: true,
  deliveryPrice: true,
  price: true,
  availability: true,
  availableFrom: true,
  slots: {
    select: comboSlotSelectFields,
    orderBy: { position: 'asc' },
  },
} as const satisfies Prisma.ComboSelect;

export type ComboType = Prisma.ComboGetPayload<{
  select: typeof comboSelectFields;
}>;

export const manyComboSelectFields = {
  id: true,
  name: true,
  imageUrl: true,
  deliveryPrice: true,
  price: true,
  availability: true,
  availableFrom: true,
  slots: {
    select: comboSlotAvailabilitySelectFields,
  },
} as const satisfies Prisma.ComboSelect;

export type ManyCombosType = Prisma.ComboGetPayload<{
  select: typeof manyComboSelectFields;
}>;

export const comboInFolderSelectFields = {
  id: true,
  name: true,
  deliveryPrice: true,
  price: true,
  position: true,
  availability: true,
  availableFrom: true,
  imageFileId: true,
  imageUrl: true,
} as const satisfies Prisma.ComboSelect;

export type ComboInFolder = Prisma.ComboGetPayload<{
  select: typeof comboInFolderSelectFields;
}>;
