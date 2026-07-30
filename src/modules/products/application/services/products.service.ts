import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  CreateProduct,
  CreateProductsRequest,
  ProductEditResponse,
  ProductListResponse,
  ProductResponse,
  UpdateAvailabilityRequest,
  UpdateProduct,
} from '@bringit/contracts';
import {
  computeAvailableFrom,
  isCurrentlyAvailable,
  isModifierAvailable,
} from '../../../../shared/utils';
import { checkSelectionRange } from '../../../modifier-groups/domain/utils';
import { isProductAvailable } from '../../domain/utils';
import { MENU_MANAGEMENT_ERRORS } from '@bringit/contracts';
import type {
  OneProductWithModifierGroupsType,
  OneProductWithTypesType,
  ManyProductsType,
} from '../../../../infrastructure/database/prisma/select';
import { SUCCESS_MESSAGES } from '../../../../shared/constants';
import {
  PrismaService,
  toLocalizedInput,
  asLocalized,
} from '../../../../infrastructure/database/prisma';
import { ProductRepository } from '../../infrastructure/repositories';
import { LocationProductTypesService } from '../../../location-product-types/application/services';
import { ModifierGroupsService } from '../../../modifier-groups/application/services';
import { LocationDisabledTemplateRepository } from '../../../location-disabled-templates/infrastructure/repositories';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productRepository: ProductRepository,
    private readonly locationProductTypesService: LocationProductTypesService,
    private readonly modifierGroupsService: ModifierGroupsService,
    private readonly locationDisabledTemplateRepository: LocationDisabledTemplateRepository,
  ) {}

  async getById(id: string): Promise<ProductResponse> {
    const product = await this.productRepository.findById(id);
    if (!product || product.deletedAt !== null) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.PRODUCT_NOT_FOUND);
    }
    const disabledTemplateIds =
      await this.locationDisabledTemplateRepository.findTemplateIdsByLocationId(
        product.locationId,
      );
    return this.mapProductResponse(product, disabledTemplateIds);
  }

  async getByIdForEdit(id: string): Promise<ProductEditResponse> {
    const product = await this.getById(id);
    return asLocalized<ProductEditResponse>(product);
  }

  async getByLocationProductTypeId(
    locationProductTypeId: string,
  ): Promise<ProductListResponse[]> {
    const products =
      await this.productRepository.findManyByLocationProductTypeId(
        locationProductTypeId,
      );

    return products.map((product) => this.mapProductListResponse(product));
  }

  async create(dto: CreateProductsRequest): Promise<{ message: string }> {
    await this.prisma.$transaction(async (tx) => {
      await this.locationProductTypesService.validateLocationProductTypesBatch(
        dto.products,
        tx,
      );
      await Promise.all(
        dto.products.map((item) => this.createSingleProduct(item, tx)),
      );
    });
    return { message: SUCCESS_MESSAGES.PRODUCTS_CREATED };
  }

  private async createSingleProduct(
    item: CreateProduct,
    tx: Prisma.TransactionClient,
  ): Promise<OneProductWithTypesType> {
    const productData: Prisma.ProductUncheckedCreateInput = {
      locationProductTypeId: item.locationProductTypeId,
      name: item.name,
      description: toLocalizedInput(item.description ?? null),
      imageFileId: item.imageFileId ?? null,
      imageUrl: item.imageUrl ?? null,
      deliveryPrice: item.deliveryPrice,
      price: item.price,
      locationId: item.locationId,
      shape: item.shape ?? null,
      sizeId: item.sizeId ?? null,
      familyId: item.familyId ?? null,
      kitchenId: item.kitchenId ?? null,
      folderId: item.folderId ?? null,
      tags: item.tags ?? [],
      templateId: item.templateId ?? null,
      modifierGroups: {
        create: item.modifierGroups.map((modifierGroup) => {
          checkSelectionRange(modifierGroup.minSelect, modifierGroup.maxSelect);
          return {
            name: modifierGroup.name,
            position: modifierGroup.position,
            minSelect: modifierGroup.minSelect,
            maxSelect: modifierGroup.maxSelect,
            fixedPriceLimit: modifierGroup.fixedPriceLimit,
            fixedPrice: modifierGroup.fixedPrice,
            isSliceable: modifierGroup.isSliceable,
            allowDuplicateModifiers: modifierGroup.allowDuplicateModifiers,
            modifiers: {
              create: modifierGroup.modifiers.map((modifier) => ({
                templateId: modifier.templateId ?? null,
                name: modifier.name,
                price: modifier.price,
                imageFileId: modifier.imageFileId ?? null,
                imageUrl: modifier.imageUrl ?? null,
                tags: modifier.tags ?? [],
              })),
            },
          };
        }),
      },
    };

    return this.productRepository.create(productData, tx);
  }

  async update(id: string, data: UpdateProduct): Promise<{ message: string }> {
    await this.prisma.$transaction(async (tx) => {
      const { modifierGroups, ...productData } = data;
      await this.assertExists(id, tx);
      await this.productRepository.update(
        id,
        {
          ...productData,
          name: productData.name,
          description: toLocalizedInput(productData.description),
        },
        tx,
      );

      if (modifierGroups) {
        await this.modifierGroupsService.replaceProductModifierGroups({
          productId: id,
          modifierGroups,
          tx,
        });
      }
    });
    return { message: SUCCESS_MESSAGES.PRODUCTS_UPDATED };
  }

  async delete(id: string): Promise<void> {
    await this.assertExists(id);
    await this.productRepository.softDelete(id);
  }

  async updateAvailability(
    id: string,
    dto: UpdateAvailabilityRequest,
  ): Promise<{ message: string }> {
    await this.assertExists(id);
    await this.productRepository.update(id, {
      availability: dto.availability,
      availableFrom: computeAvailableFrom(dto.availability),
    });

    return { message: SUCCESS_MESSAGES.PRODUCTS_UPDATED };
  }

  private async assertExists(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const exists = await this.productRepository.exists(id, tx);
    if (!exists) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.PRODUCT_NOT_FOUND);
    }
  }

  private mapProductListResponse(
    product: ManyProductsType,
  ): ProductListResponse {
    return {
      ...product,
      name: asLocalized<string>(product.name),
      isAvailable: isCurrentlyAvailable(product),
    };
  }

  private mapProductResponse(
    product: OneProductWithModifierGroupsType,
    disabledTemplateIds: ReadonlySet<string>,
  ): ProductResponse {
    return asLocalized<ProductResponse>({
      ...product,
      isAvailable: isProductAvailable(product, disabledTemplateIds),
      modifierGroups: product.modifierGroups.map((modifierGroup) => ({
        ...modifierGroup,
        locationId: product.locationId,
        modifiers: modifierGroup.modifiers.map((modifier) => ({
          ...modifier,
          isAvailable: isModifierAvailable(modifier, disabledTemplateIds),
        })),
      })),
    });
  }
}
