import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  CategoryItemInput,
  CategoryResponse,
  CategoryEditResponse,
  CreateCategory,
  MenuCategoryResponse,
  ReorderCategories,
  SaveCategoryItems,
  UpdateCategory,
} from '@bringit/contracts';
import { MENU_MANAGEMENT_ERRORS } from '@bringit/contracts';
import { CategoryRepository } from '../../infrastructure/repositories';
import { ProductRepository } from '../../../products/infrastructure/repositories';
import { ComboRepository } from '../../../combos/infrastructure/repositories';
import { LocationDisabledTemplateRepository } from '../../../location-disabled-templates/infrastructure/repositories';
import { mapMenuCategory } from '../../domain/mappers';
import {
  PrismaService,
  toLocalizedInput,
  asLocalized,
} from '../../../../infrastructure/database/prisma';
import {
  CategoryWithItemsType,
  CategoryType,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly comboRepository: ComboRepository,
    private readonly locationDisabledTemplateRepository: LocationDisabledTemplateRepository,
  ) {}

  getWithItemsByLocationId(
    locationId: string,
  ): Promise<CategoryWithItemsType[]> {
    return this.categoryRepository.findManyWithItemsByLocationId(locationId);
  }

  async getByLocationId(locationId: string): Promise<CategoryResponse[]> {
    const categories =
      await this.categoryRepository.findManyByLocationId(locationId);
    return asLocalized<CategoryResponse[]>(categories);
  }

  async getById(id: string): Promise<MenuCategoryResponse> {
    const category = await this.categoryRepository.findByIdWithItems(id);
    if (!category) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.CATEGORY_NOT_FOUND);
    }
    const disabledTemplateIds =
      await this.locationDisabledTemplateRepository.findTemplateIdsByLocationId(
        category.locationId,
      );
    return mapMenuCategory(category, disabledTemplateIds);
  }

  async getByIdForEdit(id: string): Promise<CategoryEditResponse> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.CATEGORY_NOT_FOUND);
    }
    return asLocalized<CategoryEditResponse>(category);
  }

  async create(dto: CreateCategory): Promise<CategoryResponse> {
    const category = await this.categoryRepository.create({
      locationId: dto.locationId,
      name: dto.name,
      description: toLocalizedInput(dto.description ?? null),
      iconId: dto.iconId ?? null,
      imageFileId: dto.imageFileId ?? null,
      imageUrl: dto.imageUrl ?? null,
      position: dto.position,
    });
    return asLocalized<CategoryResponse>(category);
  }

  async update(id: string, dto: UpdateCategory): Promise<CategoryResponse> {
    await this.assertCategoryExists(id);
    const category = await this.categoryRepository.update(id, {
      name: dto.name,
      description: toLocalizedInput(dto.description),
      iconId: dto.iconId,
      imageFileId: dto.imageFileId,
      imageUrl: dto.imageUrl,
      position: dto.position,
    });
    return asLocalized<CategoryResponse>(category);
  }

  async reorder(dto: ReorderCategories): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingIds = await this.categoryRepository.findIdsByLocationId(
        dto.locationId,
        tx,
      );

      this.assertExactCategorySet(existingIds, dto.categoryIds);

      for (const [index, id] of dto.categoryIds.entries()) {
        await this.categoryRepository.update(id, { position: index }, tx);
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.assertCategoryExists(id);
    await this.categoryRepository.softDelete(id);
  }

  async saveItems(
    id: string,
    dto: SaveCategoryItems,
  ): Promise<MenuCategoryResponse> {
    const category = await this.assertCategoryExists(id);

    const itemRows = dto.items.map((item, index) => ({
      categoryId: id,
      productId: item.productId ?? null,
      comboId: item.comboId ?? null,
      position: index,
    }));

    await this.prisma.$transaction(async (tx) => {
      await this.validateItemRefs(category.locationId, dto.items, tx);
      await this.categoryRepository.deleteItems(id, tx);
      await this.categoryRepository.createItems(itemRows, tx);
    });

    return this.getById(id);
  }

  private async validateItemRefs(
    locationId: string,
    items: CategoryItemInput[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const productIds = new Set<string>();
    const comboIds = new Set<string>();

    for (const item of items) {
      if (item.productId) productIds.add(item.productId);
      else if (item.comboId) comboIds.add(item.comboId);
    }

    const [productCount, comboCount] = await Promise.all([
      this.productRepository.countExisting([...productIds], locationId, tx),
      this.comboRepository.countExisting([...comboIds], locationId, tx),
    ]);

    if (productCount !== productIds.size || comboCount !== comboIds.size) {
      throw new BadRequestException(
        MENU_MANAGEMENT_ERRORS.CATEGORY_ITEM_NOT_FOUND_OR_MISMATCH,
      );
    }
  }

  private assertExactCategorySet(
    existingIds: string[],
    incomingIds: string[],
  ): void {
    const incoming = new Set(incomingIds);

    const isExactSet =
      incoming.size === incomingIds.length &&
      incoming.size === existingIds.length &&
      existingIds.every((id) => incoming.has(id));

    if (!isExactSet) {
      throw new BadRequestException(
        MENU_MANAGEMENT_ERRORS.CATEGORY_REORDER_MISMATCH,
      );
    }
  }

  private async assertCategoryExists(id: string): Promise<CategoryType> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.CATEGORY_NOT_FOUND);
    }
    return category;
  }
}
