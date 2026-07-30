import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { LocalizedText } from '@bringit/contracts';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  productTypeSizeSelectFields,
  ProductTypeSizeType,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class ProductTypeSizeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByLocationProductTypeId(
    locationProductTypeId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductTypeSizeType[]> {
    const client = tx ?? this.prisma;
    return client.productTypeSize.findMany({
      where: { locationProductTypeId, deletedAt: null },
      select: productTypeSizeSelectFields,
      orderBy: [{ position: 'asc' }],
    });
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductTypeSizeType | null> {
    const client = tx ?? this.prisma;
    return client.productTypeSize.findFirst({
      where: { id, deletedAt: null },
      select: productTypeSizeSelectFields,
    });
  }

  async existsByName(
    locationProductTypeId: string,
    name: LocalizedText,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean> {
    const client = tx ?? this.prisma;
    const found = await client.productTypeSize.findFirst({
      where: {
        locationProductTypeId,
        name: { path: ['he'], equals: name.he },
        deletedAt: null,
      },
      select: { id: true },
    });
    return found !== null;
  }

  async create(
    data: Prisma.ProductTypeSizeUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductTypeSizeType> {
    const client = tx ?? this.prisma;
    return client.productTypeSize.create({
      data,
      select: productTypeSizeSelectFields,
    });
  }

  async update(
    id: string,
    data: Prisma.ProductTypeSizeUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductTypeSizeType> {
    const client = tx ?? this.prisma;
    return client.productTypeSize.update({
      where: { id },
      data,
      select: productTypeSizeSelectFields,
    });
  }

  async softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;
    await client.productTypeSize.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
