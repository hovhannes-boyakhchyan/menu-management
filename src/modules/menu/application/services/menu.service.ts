import { Injectable } from '@nestjs/common';
import type { MenuCategoryResponse } from '@bringit/contracts';
import { CategoriesService } from '../../../categories/application/services';
import { mapMenuCategory } from '../../../categories/domain/mappers';
import { LocationDisabledTemplateRepository } from '../../../location-disabled-templates/infrastructure/repositories';

@Injectable()
export class MenuService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly locationDisabledTemplateRepository: LocationDisabledTemplateRepository,
  ) {}

  async getMenuByLocationId(
    locationId: string,
    includeEmpty = false,
  ): Promise<MenuCategoryResponse[]> {
    const [categories, disabledTemplateIds] = await Promise.all([
      this.categoriesService.getWithItemsByLocationId(locationId),
      this.locationDisabledTemplateRepository.findTemplateIdsByLocationId(
        locationId,
      ),
    ]);

    const menuCategories = categories.map((category) =>
      mapMenuCategory(category, disabledTemplateIds),
    );

    return includeEmpty
      ? menuCategories
      : menuCategories.filter((category) => category.items.length > 0);
  }
}
