import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  modifierGroupSelectFields,
  ModifierGroupType,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class ModifierGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ModifierGroupType | null> {
    const client = tx ?? this.prisma;
    return client.modifierGroup.findUnique({
      where: { id },
      select: modifierGroupSelectFields,
    });
  }

  async create(
    data: Prisma.ModifierGroupUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ModifierGroupType> {
    const client = tx ?? this.prisma;
    return client.modifierGroup.create({
      data,
      select: modifierGroupSelectFields,
    });
  }

  async update(
    id: string,
    data: Prisma.ModifierGroupUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ModifierGroupType> {
    const client = tx ?? this.prisma;
    return client.modifierGroup.update({
      where: { id },
      data,
      select: modifierGroupSelectFields,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;
    await client.modifierGroup.delete({
      where: { id },
    });
  }

  async findManyByProductIdWithModifierIds(
    productId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<{ id: string; modifiers: { id: string }[] }[]> {
    const client = tx ?? this.prisma;
    return client.modifierGroup.findMany({
      where: { productId },
      select: {
        id: true,
        modifiers: { select: { id: true } },
      },
    });
  }

  async deleteMany(
    ids: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    if (!ids.length) {
      return;
    }
    const client = tx ?? this.prisma;
    await client.modifierGroup.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
