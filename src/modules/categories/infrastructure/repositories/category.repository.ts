import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  CategoryWithItemsType,
  categoryWithItemsSelectFields,
  CategoryType,
  categorySelectFields,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyWithItemsByLocationId(
    locationId: string,
  ): Promise<CategoryWithItemsType[]> {
    return this.prisma.category.findMany({
      where: { locationId, deletedAt: null },
      select: categoryWithItemsSelectFields,
      orderBy: { position: 'asc' },
    });
  }

  async findManyByLocationId(locationId: string): Promise<CategoryType[]> {
    return this.prisma.category.findMany({
      where: { locationId, deletedAt: null },
      select: categorySelectFields,
      orderBy: { position: 'asc' },
    });
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CategoryType | null> {
    const client = tx ?? this.prisma;
    return client.category.findFirst({
      where: { id, deletedAt: null },
      select: categorySelectFields,
    });
  }

  async findByIdWithItems(id: string): Promise<CategoryWithItemsType | null> {
    return this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      select: categoryWithItemsSelectFields,
    });
  }

  async create(
    data: Prisma.CategoryUncheckedCreateInput,
  ): Promise<CategoryType> {
    return this.prisma.category.create({
      data,
      select: categorySelectFields,
    });
  }

  async update(
    id: string,
    data: Prisma.CategoryUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<CategoryType> {
    const client = tx ?? this.prisma;
    return client.category.update({
      where: { id },
      data,
      select: categorySelectFields,
    });
  }

  async findIdsByLocationId(
    locationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<string[]> {
    const client = tx ?? this.prisma;
    const rows = await client.category.findMany({
      where: { locationId, deletedAt: null },
      select: { id: true },
    });
    return rows.map((row) => row.id);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async deleteItems(
    categoryId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.categoryItem.deleteMany({ where: { categoryId } });
  }

  async createItems(
    data: Prisma.CategoryItemCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.categoryItem.createMany({ data });
  }
}
