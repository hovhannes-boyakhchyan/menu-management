import { Injectable, NotFoundException } from '@nestjs/common';
import { MENU_MANAGEMENT_ERRORS } from '@bringit/contracts';
import { SUCCESS_MESSAGES } from '../../../../shared/constants';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import { LocationDisabledTemplateRepository } from '../../infrastructure/repositories';
import type {
  LocationDisabledTemplatesResponse,
  ToggleLocationDisabledTemplateResponse,
} from '@bringit/contracts';
import { CatalogTemplateRepository } from '../../../catalog-templates/infrastructure/repositories';

@Injectable()
export class LocationDisabledTemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly locationDisabledTemplateRepository: LocationDisabledTemplateRepository,
    private readonly catalogTemplateRepository: CatalogTemplateRepository,
  ) {}

  async getDisabledTemplates(
    locationId: string,
  ): Promise<LocationDisabledTemplatesResponse> {
    return this.locationDisabledTemplateRepository.findByLocationId(locationId);
  }

  async toggleTemplateStatus(
    locationId: string,
    templateId: string,
  ): Promise<ToggleLocationDisabledTemplateResponse> {
    return this.prisma.$transaction(async (tx) => {
      const exists = await this.locationDisabledTemplateRepository.exists(
        locationId,
        templateId,
        tx,
      );

      if (exists) {
        await this.locationDisabledTemplateRepository.delete(
          locationId,
          templateId,
          tx,
        );
        return {
          status: true,
          message: SUCCESS_MESSAGES.TEMPLATE_NOW_IN_STOCK,
        };
      }

      const templateExists = await this.catalogTemplateRepository.exists(
        templateId,
        tx,
      );
      if (!templateExists) {
        throw new NotFoundException(
          MENU_MANAGEMENT_ERRORS.CATALOG_TEMPLATE_NOT_FOUND,
        );
      }

      await this.locationDisabledTemplateRepository.create(
        { locationId, templateId },
        tx,
      );
      return {
        status: true,
        message: SUCCESS_MESSAGES.TEMPLATE_NOW_OUT_OF_STOCK,
      };
    });
  }
}
