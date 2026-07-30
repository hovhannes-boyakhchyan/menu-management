import { BadRequestException } from '@nestjs/common';
import { MENU_MANAGEMENT_ERRORS } from '@bringit/contracts';

export function isMandatory(group: { minSelect: number }): boolean {
  return group.minSelect > 0;
}

export function checkSelectionRange(
  minSelect: number,
  maxSelect: number,
): void {
  if (maxSelect && minSelect > maxSelect) {
    throw new BadRequestException(
      MENU_MANAGEMENT_ERRORS.MODIFIER_SELECTION_RANGE_INVALID,
    );
  }
}
