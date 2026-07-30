import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  MENU_MANAGEMENT_ERRORS,
  LocationProductType,
  LocationProductTypeResponse,
  CreateLocationProductType,
  SaveAllLocationProductTypeItems,
  UpdateLocationProductType,
} from '@bringit/contracts';
import { LocationProductTypeRepository } from '../../infrastructure/repositories';
import { OneLocationProductType } from '../../../../infrastructure/database/prisma/select';
import {
  toLocalizedInput,
  asLocalized,
} from '../../../../infrastructure/database/prisma';

@Injectable()
export class LocationProductTypesService {
  constructor(
    private readonly locationProductTypeRepository: LocationProductTypeRepository,
  ) {}

  async getLocationProductTypes(
    locationId: string,
  ): Promise<LocationProductTypeResponse[]> {
    const locationProductTypes =
      await this.locationProductTypeRepository.findManyByLocationId(locationId);
    return asLocalized<LocationProductTypeResponse[]>(locationProductTypes);
  }

  async getByIdForEdit(id: string): Promise<LocationProductType> {
    const locationProductType =
      await this.locationProductTypeRepository.findById(id);
    if (!locationProductType) {
      throw new NotFoundException(
        MENU_MANAGEMENT_ERRORS.LOCATION_PRODUCT_TYPE_NOT_FOUND,
      );
    }
    return asLocalized<LocationProductType>(locationProductType);
  }

  async createLocationProductType(
    data: CreateLocationProductType,
  ): Promise<LocationProductTypeResponse> {
    const locationProductType = await this.locationProductTypeRepository.create(
      {
        locationId: data.locationId,
        name: data.name,
        description: toLocalizedInput(data.description),
        productTypeId: data.productTypeId,
        iconId: data.iconId ?? null,
        icon3dId: data.icon3dId ?? null,
        position: data.position,
        sizes: data.sizes?.length
          ? {
              create: data.sizes.map((size) => ({
                name: size.name,
                code: size.code ?? null,
                position: size.position,
              })),
            }
          : undefined,
      },
    );
    return asLocalized<LocationProductTypeResponse>(locationProductType);
  }

  async updateLocationProductType(
    id: string,
    data: UpdateLocationProductType,
  ): Promise<LocationProductTypeResponse> {
    await this.assertLocationProductTypeExists(id);
    const locationProductType = await this.locationProductTypeRepository.update(
      id,
      {
        ...data,
        description: toLocalizedInput(data.description),
      },
    );
    return asLocalized<LocationProductTypeResponse>(locationProductType);
  }

  async deleteLocationProductType(id: string): Promise<void> {
    await this.assertLocationProductTypeExists(id);
    return this.locationProductTypeRepository.softDelete(id);
  }

  async upsertLocationProductTypes(
    locationProductTypeData: SaveAllLocationProductTypeItems,
  ): Promise<LocationProductTypeResponse[]> {
    const items: Prisma.LocationProductTypeUncheckedCreateInput[] =
      locationProductTypeData.items.map((item) => ({
        id: item.id,
        locationId: item.locationId,
        name: item.name,
        description: toLocalizedInput(item.description),
        productTypeId: item.productTypeId,
        iconId: item.iconId ?? null,
        icon3dId: item.icon3dId ?? null,
        position: item.position,
      }));
    const locationProductTypes =
      await this.locationProductTypeRepository.upsertMany(items);
    return asLocalized<LocationProductTypeResponse[]>(locationProductTypes);
  }

  async validateLocationProductTypesBatch(
    validationParams: Array<{
      locationProductTypeId: string;
      locationId: string;
    }>,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    if (!validationParams.length) return;

    await this.locationProductTypeRepository.validateAllExist(
      validationParams,
      tx,
    );
  }

  private async assertLocationProductTypeExists(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<OneLocationProductType> {
    const locationProductType =
      await this.locationProductTypeRepository.findById(id, tx);
    if (!locationProductType) {
      throw new NotFoundException(
        MENU_MANAGEMENT_ERRORS.LOCATION_PRODUCT_TYPE_NOT_FOUND,
      );
    }
    return locationProductType;
  }
}
