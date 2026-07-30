import { MenuItemAvailability } from '@prisma/client';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface AvailabilityFields {
  availability: MenuItemAvailability;
  availableFrom: Date | null;
}

interface ModifierAvailabilityFields extends AvailabilityFields {
  templateId: string | null;
}

export function isCurrentlyAvailable(
  entity: AvailabilityFields,
  now: Date = new Date(),
): boolean {
  if (entity.availability === MenuItemAvailability.available) return true;
  if (entity.availability === MenuItemAvailability.sold_out) return false;
  return entity.availableFrom !== null && entity.availableFrom <= now;
}

export function isModifierAvailable(
  modifier: ModifierAvailabilityFields,
  disabledTemplateIds: ReadonlySet<string>,
  now: Date = new Date(),
): boolean {
  if (
    modifier.templateId !== null &&
    disabledTemplateIds.has(modifier.templateId)
  ) {
    return false;
  }
  return isCurrentlyAvailable(modifier, now);
}

export function computeAvailableFrom(
  availability: MenuItemAvailability,
  now: Date = new Date(),
): Date | null {
  if (availability !== MenuItemAvailability.sold_out_today) return null;
  return new Date(now.getTime() + ONE_DAY_MS);
}
