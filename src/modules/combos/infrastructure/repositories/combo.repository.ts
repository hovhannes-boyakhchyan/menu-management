import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  ComboInFolder,
  comboInFolderSelectFields,
  ComboType,
  comboSelectFields,
  ManyCombosType,
  manyComboSelectFields,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class ComboRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ComboType | null> {
    const client = tx ?? this.prisma;
    return client.combo.findFirst({
      where: { id, deletedAt: null },
      select: comboSelectFields,
    });
  }

  async create(
    data: Prisma.ComboUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ComboType> {
    const client = tx ?? this.prisma;
    return client.combo.create({ data, select: comboSelectFields });
  }

  async update(
    id: string,
    data: Prisma.ComboUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ComboType> {
    const client = tx ?? this.prisma;
    return client.combo.update({
      where: { id },
      data,
      select: comboSelectFields,
    });
  }

  async exists(id: string, tx?: Prisma.TransactionClient): Promise<boolean> {
    const client = tx ?? this.prisma;
    const found = await client.combo.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return found !== null;
  }

  async countExisting(
    ids: string[],
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    if (!ids.length) return 0;
    const client = tx ?? this.prisma;
    return client.combo.count({
      where: { id: { in: ids }, locationId, deletedAt: null },
    });
  }

  async findManyByLocationId(
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ManyCombosType[]> {
    const client = tx ?? this.prisma;
    return client.combo.findMany({
      where: { locationId, deletedAt: null },
      select: manyComboSelectFields,
      orderBy: { position: 'asc' },
    });
  }

  async findManyByFolder(
    locationId: string,
    folderId: string | null,
  ): Promise<ComboInFolder[]> {
    return this.prisma.combo.findMany({
      where: { locationId, folderId, deletedAt: null },
      select: comboInFolderSelectFields,
    });
  }

  async findManyByName(
    locationId: string,
    name: string,
  ): Promise<ComboInFolder[]> {
    if (!name) {
      return this.prisma.combo.findMany({
        where: { locationId, deletedAt: null },
        select: comboInFolderSelectFields,
      });
    }

    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM combos
      WHERE location_id = ${locationId}
        AND deleted_at IS NULL
        AND EXISTS (
          SELECT 1 FROM jsonb_each_text(name) AS kv
          WHERE kv.value ILIKE ${'%' + name + '%'}
        )
    `;

    const ids = rows.map((row) => row.id);
    if (!ids.length) return [];

    return this.prisma.combo.findMany({
      where: { id: { in: ids } },
      select: comboInFolderSelectFields,
    });
  }

  async softDeleteMany(
    ids: string[],
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.combo.updateMany({
      where: { id: { in: ids }, locationId },
      data: { deletedAt: new Date() },
    });
  }

  async moveToFolder(
    ids: string[],
    targetFolderId: string | null,
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.combo.updateMany({
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
        client.combo.updateMany({
          where: { id: item.id, locationId, folderId },
          data: { position: item.position },
        }),
      ),
    );
  }
}
