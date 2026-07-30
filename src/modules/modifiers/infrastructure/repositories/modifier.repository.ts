import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  modifierSelectFields,
  ModifierType,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class ModifierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.ModifierUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ModifierType> {
    const client = tx ?? this.prisma;
    return client.modifier.create({
      data,
      select: modifierSelectFields,
    });
  }

  async update(
    id: string,
    data: Prisma.ModifierUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ModifierType> {
    const client = tx ?? this.prisma;
    return client.modifier.update({
      where: { id },
      data,
      select: modifierSelectFields,
    });
  }

  async exists(id: string, tx?: Prisma.TransactionClient): Promise<boolean> {
    const client = tx ?? this.prisma;
    const found = await client.modifier.findUnique({
      where: { id },
      select: { id: true },
    });
    return found !== null;
  }

  async deleteMany(
    ids: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    if (!ids.length) {
      return;
    }
    const client = tx ?? this.prisma;
    await client.modifier.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
