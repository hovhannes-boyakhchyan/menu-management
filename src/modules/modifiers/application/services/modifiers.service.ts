import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MENU_MANAGEMENT_ERRORS,
  UpdateAvailabilityRequest,
} from '@bringit/contracts';
import { computeAvailableFrom } from '../../../../shared/utils';
import { SUCCESS_MESSAGES } from '../../../../shared/constants';
import { ModifierRepository } from '../../infrastructure/repositories';

@Injectable()
export class ModifiersService {
  constructor(private readonly modifierRepository: ModifierRepository) {}

  async updateAvailability(
    id: string,
    dto: UpdateAvailabilityRequest,
  ): Promise<{ message: string }> {
    const exists = await this.modifierRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.MODIFIER_NOT_FOUND);
    }

    await this.modifierRepository.update(id, {
      availability: dto.availability,
      availableFrom: computeAvailableFrom(dto.availability),
    });

    return { message: SUCCESS_MESSAGES.MODIFIER_AVAILABILITY_UPDATED };
  }
}
