import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  oneProductWithTypesSelectFields,
  OneProductWithTypesType,
  oneProductWithModifierGroupsSelectFields,
  OneProductWithModifierGroupsType,
  productInFolderSelectFields,
  ProductInFolder,
  manyProductSelectFields,
  ManyProductsType,
  manyProductWithTypeSelectFields,
  ManyProductsWithTypeType,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByFolder(
    locationId: string,
    folderId: string | null,
  ): Promise<ProductInFolder[]> {
    return this.prisma.product.findMany({
      where: { locationId, folderId, deletedAt: null },
      select: productInFolderSelectFields,
    });
  }

  async findManyByName(
    locationId: string,
    name: string,
  ): Promise<ProductInFolder[]> {
    if (!name) {
      return this.prisma.product.findMany({
        where: { locationId, deletedAt: null },
        select: productInFolderSelectFields,
      });
    }

    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM products
      WHERE location_id = ${locationId}
        AND deleted_at IS NULL
        AND EXISTS (
          SELECT 1 FROM jsonb_each_text(name) AS kv
          WHERE kv.value ILIKE ${'%' + name + '%'}
        )
    `;

    const ids = rows.map((row) => row.id);
    if (!ids.length) return [];

    return this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: productInFolderSelectFields,
    });
  }

  async moveToFolder(
    ids: string[],
    targetFolderId: string | null,
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.product.updateMany({
      where: { id: { in: ids }, locationId },
      data: { folderId: targetFolderId },
    });
  }

  async updatePositions(
    locationId: string,
    folderId: string | null,
    items: { id: string; position: number }[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await Promise.all(
      items.map((item) =>
        client.product.updateMany({
          where: { id: item.id, locationId, folderId },
          data: { position: item.position },
        }),
      ),
    );
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<OneProductWithModifierGroupsType | null> {
    const client = tx ?? this.prisma;
    return client.product.findUnique({
      where: { id },
      select: oneProductWithModifierGroupsSelectFields,
    });
  }

  async exists(id: string, tx?: Prisma.TransactionClient): Promise<boolean> {
    const client = tx ?? this.prisma;
    const product = await client.product.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return product !== null;
  }

  async countExisting(
    ids: string[],
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    if (!ids.length) return 0;
    const client = tx ?? this.prisma;
    return client.product.count({
      where: { id: { in: ids }, locationId, deletedAt: null },
    });
  }

  async findManyByLocationProductTypeId(
    locationProductTypeId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ManyProductsType[]> {
    const client = tx ?? this.prisma;
    return client.product.findMany({
      where: { locationProductTypeId, deletedAt: null },
      select: manyProductSelectFields,
    });
  }

  async findManyByLocationId(
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ManyProductsWithTypeType[]> {
    const client = tx ?? this.prisma;
    return client.product.findMany({
      where: { locationId, deletedAt: null },
      select: manyProductWithTypeSelectFields,
      orderBy: { position: 'asc' },
    });
  }

  async findMany(
    where: Prisma.ProductWhereInput,
    tx?: Prisma.TransactionClient,
  ): Promise<OneProductWithModifierGroupsType[]> {
    const client = tx ?? this.prisma;
    return client.product.findMany({
      where,
      select: oneProductWithModifierGroupsSelectFields,
    });
  }

  async create(
    data: Prisma.ProductUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<OneProductWithTypesType> {
    const client = tx ?? this.prisma;
    return client.product.create({
      data,
      select: oneProductWithTypesSelectFields,
    });
  }

  async update(
    id: string,
    data: Prisma.ProductUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<OneProductWithTypesType> {
    const client = tx ?? this.prisma;
    return client.product.update({
      where: { id },
      data,
      select: oneProductWithTypesSelectFields,
    });
  }

  async softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;
    await client.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async softDeleteMany(
    ids: string[],
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.product.updateMany({
      where: { id: { in: ids }, locationId },
      data: { deletedAt: new Date() },
    });
  }
}
