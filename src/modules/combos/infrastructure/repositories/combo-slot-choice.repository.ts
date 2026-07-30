import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';

@Injectable()
export class ComboSlotChoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    data: Prisma.ComboSlotChoiceUncheckedCreateInput[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.comboSlotChoice.createMany({ data });
  }

  async upsertOne(
    data: Prisma.ComboSlotChoiceUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<{ id: string }> {
    const client = tx ?? this.prisma;
    return client.comboSlotChoice.upsert({
      where: {
        slotId_productId: { slotId: data.slotId, productId: data.productId },
      },
      create: data,
      update: {
        priceDelta: data.priceDelta,
        position: data.position,
        isDefault: data.isDefault,
      },
      select: { id: true },
    });
  }

  async deleteOthers(
    slotId: string,
    keepIds: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.comboSlotChoice.deleteMany({
      where: { slotId, id: { notIn: keepIds } },
    });
  }
}
