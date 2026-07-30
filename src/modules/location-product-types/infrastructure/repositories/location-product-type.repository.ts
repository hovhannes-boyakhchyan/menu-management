import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MENU_MANAGEMENT_ERRORS } from '@bringit/contracts';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  oneLocationProductTypeSelectFields,
  OneLocationProductType,
  ManyLocationProductType,
  manyLocationProductTypeSelectFields,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class LocationProductTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByLocationId(
    locationId: string,
  ): Promise<ManyLocationProductType[]> {
    return this.prisma.locationProductType.findMany({
      where: { locationId, deletedAt: null },
      select: manyLocationProductTypeSelectFields,
      orderBy: { position: 'asc' },
    });
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<OneLocationProductType | null> {
    const client = tx ?? this.prisma;
    return client.locationProductType.findFirst({
      where: { id, deletedAt: null },
      select: oneLocationProductTypeSelectFields,
    });
  }

  async create(
    data: Prisma.LocationProductTypeUncheckedCreateInput,
  ): Promise<OneLocationProductType> {
    const { sizes, ...scalar } = data;

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.locationProductType.findUnique({
        where: {
          locationId_productTypeId: {
            locationId: scalar.locationId,
            productTypeId: scalar.productTypeId,
          },
        },
        select: { id: true, deletedAt: true },
      });

      if (!existing) {
        return tx.locationProductType.create({
          data,
          select: oneLocationProductTypeSelectFields,
        });
      }

      if (!existing.deletedAt) {
        throw new BadRequestException(
          MENU_MANAGEMENT_ERRORS.LOCATION_PRODUCT_TYPE_ALREADY_EXISTS,
        );
      }

      await tx.productTypeSize.updateMany({
        where: { locationProductTypeId: existing.id, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      return tx.locationProductType.update({
        where: { id: existing.id },
        data: {
          ...scalar,
          deletedAt: null,
          ...(sizes ? { sizes } : {}),
        },
        select: oneLocationProductTypeSelectFields,
      });
    });
  }

  async update(
    id: string,
    data: Prisma.LocationProductTypeUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<OneLocationProductType> {
    const client = tx ?? this.prisma;
    return client.locationProductType.update({
      where: { id },
      data,
      select: oneLocationProductTypeSelectFields,
    });
  }

  async softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;
    await client.locationProductType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async validateAllExist(
    validationParams: Array<{
      locationProductTypeId: string;
      locationId: string;
    }>,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    if (!validationParams.length) return;

    const uniqueParamsList = Array.from(
      new Map(
        validationParams.map((t) => [
          `${t.locationProductTypeId}|${t.locationId}`,
          t,
        ]),
      ).values(),
    );

    const count = await tx.locationProductType.count({
      where: {
        deletedAt: null,
        OR: uniqueParamsList.map((t) => ({
          id: t.locationProductTypeId,
          locationId: t.locationId,
        })),
      },
    });

    if (count !== uniqueParamsList.length) {
      throw new BadRequestException(
        MENU_MANAGEMENT_ERRORS.LOCATION_PRODUCT_TYPE_NOT_FOUND_OR_MISMATCH,
      );
    }
  }

  async upsertMany(
    items: Prisma.LocationProductTypeUncheckedCreateInput[],
  ): Promise<OneLocationProductType[]> {
    const operations = items.map(({ id, ...data }) => {
      if (id) {
        return this.prisma.locationProductType.update({
          where: { id },
          data,
          select: oneLocationProductTypeSelectFields,
        });
      }

      const { locationId, productTypeId, ...updateData } = data;
      return this.prisma.locationProductType.upsert({
        where: {
          locationId_productTypeId: { locationId, productTypeId },
        },
        update: { ...updateData, deletedAt: null },
        create: data,
        select: oneLocationProductTypeSelectFields,
      });
    });

    try {
      return await this.prisma.$transaction(operations);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          MENU_MANAGEMENT_ERRORS.LOCATION_PRODUCT_TYPE_ALREADY_EXISTS,
        );
      }
      throw error;
    }
  }
}
