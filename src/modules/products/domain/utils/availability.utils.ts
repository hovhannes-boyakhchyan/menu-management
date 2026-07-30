import { MenuItemAvailability } from '@prisma/client';
import {
  isCurrentlyAvailable,
  isModifierAvailable,
} from '../../../../shared/utils';
import { isMandatory } from '../../../modifier-groups/domain/utils';

type AvailabilityFields = {
  availability: MenuItemAvailability;
  availableFrom: Date | null;
};

type ProductLike = AvailabilityFields & {
  modifierGroups: {
    minSelect: number;
    modifiers: (AvailabilityFields & { templateId: string | null })[];
  }[];
};

export function isProductAvailable(
  product: ProductLike,
  disabledTemplateIds: ReadonlySet<string>,
  now: Date = new Date(),
): boolean {
  if (!isCurrentlyAvailable(product, now)) return false;

  for (const group of product.modifierGroups) {
    if (!isMandatory(group)) continue;
    const availableCount = group.modifiers.filter((m) =>
      isModifierAvailable(m, disabledTemplateIds, now),
    ).length;
    if (availableCount < group.minSelect) return false;
  }
  return true;
}
