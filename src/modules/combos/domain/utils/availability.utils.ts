import { MenuItemAvailability } from '@prisma/client';
import { isCurrentlyAvailable } from '../../../../shared/utils';
import { isMandatory } from '../../../modifier-groups/domain/utils';
import { isProductAvailable } from '../../../products/domain/utils';

type AvailabilityFields = {
  availability: MenuItemAvailability;
  availableFrom: Date | null;
};

type ComboLike = AvailabilityFields & {
  slots: {
    minSelect: number;
    choices: {
      product: AvailabilityFields & {
        modifierGroups: {
          minSelect: number;
          modifiers: (AvailabilityFields & { templateId: string | null })[];
        }[];
      };
    }[];
  }[];
};

export function isComboAvailable(
  combo: ComboLike,
  disabledTemplateIds: ReadonlySet<string>,
  now: Date = new Date(),
): boolean {
  if (!isCurrentlyAvailable(combo, now)) return false;

  for (const slot of combo.slots) {
    if (!isMandatory(slot)) continue;
    const availableCount = slot.choices.filter((c) =>
      isProductAvailable(c.product, disabledTemplateIds, now),
    ).length;
    if (availableCount < slot.minSelect) return false;
  }
  return true;
}
