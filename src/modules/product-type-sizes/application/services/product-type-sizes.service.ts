import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  CreateProductTypeSizeRequest,
  ProductTypeSize,
  ProductTypeSizeResponse,
  UpdateProductTypeSizeRequest,
} from '@bringit/contracts';
import { MENU_MANAGEMENT_ERRORS } from '@bringit/contracts';
import { ProductTypeSizeRepository } from '../../infrastructure/repositories';
import { ProductTypeSizeType } from '../../../../infrastructure/database/prisma/select';
import { asLocalized } from '../../../../infrastructure/database/prisma';

@Injectable()
export class ProductTypeSizesService {
  constructor(
    private readonly productTypeSizeRepository: ProductTypeSizeRepository,
  ) {}

  async listByLocationProductType(
    locationProductTypeId: string,
  ): Promise<ProductTypeSizeResponse[]> {
    const sizes =
      await this.productTypeSizeRepository.findManyByLocationProductTypeId(
        locationProductTypeId,
      );
    return asLocalized<ProductTypeSizeResponse[]>(sizes);
  }

  async getByIdForEdit(id: string): Promise<ProductTypeSize> {
    const size = await this.productTypeSizeRepository.findById(id);
    if (!size) {
      throw new NotFoundException(
        MENU_MANAGEMENT_ERRORS.PRODUCT_TYPE_SIZE_NOT_FOUND,
      );
    }
    return asLocalized<ProductTypeSize>(size);
  }

  async create(
    dto: CreateProductTypeSizeRequest,
  ): Promise<ProductTypeSizeResponse> {
    const exists = await this.productTypeSizeRepository.existsByName(
      dto.locationProductTypeId,
      dto.name,
    );
    if (exists) {
      throw new ConflictException(
        MENU_MANAGEMENT_ERRORS.PRODUCT_TYPE_SIZE_NAME_EXISTS,
      );
    }

    const size = await this.productTypeSizeRepository.create({
      locationProductTypeId: dto.locationProductTypeId,
      name: dto.name,
      code: dto.code ?? null,
      position: dto.position,
    });
    return asLocalized<ProductTypeSizeResponse>(size);
  }

  async update(
    id: string,
    dto: UpdateProductTypeSizeRequest,
  ): Promise<ProductTypeSizeResponse> {
    await this.assertProductTypeSizeExists(id);
    const size = await this.productTypeSizeRepository.update(id, {
      name: dto.name,
      code: dto.code,
      position: dto.position,
    });
    return asLocalized<ProductTypeSizeResponse>(size);
  }

  async delete(id: string): Promise<void> {
    await this.assertProductTypeSizeExists(id);
    await this.productTypeSizeRepository.softDelete(id);
  }

  private async assertProductTypeSizeExists(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductTypeSizeType> {
    const productTypeSize = await this.productTypeSizeRepository.findById(
      id,
      tx,
    );
    if (!productTypeSize) {
      throw new NotFoundException(
        MENU_MANAGEMENT_ERRORS.PRODUCT_TYPE_SIZE_NOT_FOUND,
      );
    }
    return productTypeSize;
  }
}
