import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  BreadcrumbRow,
  breadcrumbSelectFields,
  manyFoldersSelectFields,
  ManyFoldersType,
  oneFolderSelectFields,
  OneFolderType,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class FolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.FolderUncheckedCreateInput,
  ): Promise<OneFolderType> {
    return this.prisma.folder.create({
      data,
      select: oneFolderSelectFields,
    });
  }

  async findById(id: string): Promise<OneFolderType | null> {
    return this.prisma.folder.findFirst({
      where: { id, deletedAt: null },
      select: oneFolderSelectFields,
    });
  }

  async existsWithName(
    locationId: string,
    parentId: string | null,
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    const found = await this.prisma.folder.findFirst({
      where: {
        locationId,
        parentId,
        deletedAt: null,
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return found !== null;
  }

  async findNamesByIds(
    locationId: string,
    folderIds: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<Pick<OneFolderType, 'id' | 'name'>[]> {
    const client = tx ?? this.prisma;
    return client.folder.findMany({
      where: { id: { in: folderIds }, locationId, deletedAt: null },
      select: { id: true, name: true },
    });
  }

  async findNamesByParent(
    locationId: string,
    parentId: string | null,
    excludeIds: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<string[]> {
    const client = tx ?? this.prisma;
    const folders = await client.folder.findMany({
      where: {
        locationId,
        parentId,
        deletedAt: null,
        id: { notIn: excludeIds },
      },
      select: { name: true },
    });
    return folders.map((folder) => folder.name);
  }

  async update(
    where: Prisma.FolderWhereUniqueInput,
    data: Prisma.FolderUncheckedUpdateInput,
  ): Promise<OneFolderType> {
    return this.prisma.folder.update({
      where,
      data,
      select: oneFolderSelectFields,
    });
  }

  async moveFolders(
    folderIds: string[],
    targetFolderId: string | null,
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.folder.updateMany({
      where: { id: { in: folderIds }, locationId },
      data: { parentId: targetFolderId },
    });
  }

  async updatePositions(
    locationId: string,
    parentId: string | null,
    items: { id: string; position: number }[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await Promise.all(
      items.map((item) =>
        client.folder.updateMany({
          where: {
            id: item.id,
            locationId,
            parentId,
          },
          data: { position: item.position },
        }),
      ),
    );
  }

  async findMany(query: Prisma.FolderWhereInput): Promise<ManyFoldersType[]> {
    return this.prisma.folder.findMany({
      where: query,
      select: manyFoldersSelectFields,
    });
  }

  async findManyByParent(
    locationId: string,
    parentId: string | null,
  ): Promise<ManyFoldersType[]> {
    return this.prisma.folder.findMany({
      where: { locationId, parentId, deletedAt: null },
      select: manyFoldersSelectFields,
    });
  }

  async findManyByName(
    locationId: string,
    name: string,
  ): Promise<ManyFoldersType[]> {
    return this.prisma.folder.findMany({
      where: {
        locationId,
        deletedAt: null,
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
      },
      select: manyFoldersSelectFields,
    });
  }

  async findBreadcrumb(folderId: string): Promise<BreadcrumbRow | null> {
    return this.prisma.folder.findUnique({
      where: { id: folderId },
      select: breadcrumbSelectFields,
    });
  }

  async cascadeDeleteFolders(
    locationId: string,
    folderIds: string[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const cascadeDelete = async (folderId: string): Promise<void> => {
      const children = await tx.folder.findMany({
        where: {
          parentId: folderId,
          locationId,
          deletedAt: null,
        },
        select: { id: true },
      });

      for (const child of children) {
        await cascadeDelete(child.id);
      }

      await tx.product.updateMany({
        where: { folderId, locationId },
        data: { deletedAt: new Date() },
      });

      await tx.combo.updateMany({
        where: { folderId, locationId },
        data: { deletedAt: new Date() },
      });

      await tx.folder.updateMany({
        where: { parentId: folderId, locationId },
        data: { deletedAt: new Date() },
      });
    };

    for (const id of folderIds) {
      await cascadeDelete(id);
    }

    await tx.folder.updateMany({
      where: { id: { in: folderIds }, locationId },
      data: { deletedAt: new Date() },
    });
  }
}
