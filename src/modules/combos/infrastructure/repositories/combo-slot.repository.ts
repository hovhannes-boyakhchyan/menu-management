import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';

@Injectable()
export class ComboSlotRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.ComboSlotUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<{ id: string }> {
    const client = tx ?? this.prisma;
    return client.comboSlot.create({ data, select: { id: true } });
  }

  async update(
    id: string,
    data: Prisma.ComboSlotUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<{ id: string }> {
    const client = tx ?? this.prisma;
    return client.comboSlot.update({
      where: { id },
      data,
      select: { id: true },
    });
  }

  async deleteOthers(
    comboId: string,
    keepIds: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.comboSlot.deleteMany({
      where: { comboId, id: { notIn: keepIds } },
    });
  }
}
