import { Prisma } from '@prisma/client';

export const iconSelectFields = {
  id: true,
  name: true,
  type: true,
  imageFileId: true,
  imageUrl: true,
} as const satisfies Prisma.IconSelect;

export type IconType = Prisma.IconGetPayload<{
  select: typeof iconSelectFields;
}>;
