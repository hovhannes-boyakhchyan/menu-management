import { Prisma } from '@prisma/client';
import type { LocalizedText } from '@bringit/contracts';

export const asLocalized = <T>(value: unknown): T => value as T;

export const toLocalizedInput = (
  value: LocalizedText | null | undefined,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value;
};
