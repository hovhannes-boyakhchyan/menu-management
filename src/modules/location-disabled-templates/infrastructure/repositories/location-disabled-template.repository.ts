import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  ManyLocationDisabledTemplateType,
  manyLocationDisabledTemplateSelectFields,
  OneLocationDisabledTemplateType,
  oneLocationDisabledTemplateSelectFields,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class LocationDisabledTemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByLocationId(
    locationId: string,
  ): Promise<ManyLocationDisabledTemplateType[]> {
    return this.prisma.locationDisabledTemplate.findMany({
      where: { locationId },
      select: manyLocationDisabledTemplateSelectFields,
    });
  }

  async findTemplateIdsByLocationId(locationId: string): Promise<Set<string>> {
    const rows = await this.prisma.locationDisabledTemplate.findMany({
      where: { locationId },
      select: { templateId: true },
    });
    return new Set(rows.map((row) => row.templateId));
  }

  async exists(
    locationId: string,
    templateId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean> {
    const client = tx ?? this.prisma;
    const existing = await client.locationDisabledTemplate.findUnique({
      where: {
        locationId_templateId: { locationId, templateId },
      },
      select: { id: true },
    });
    return existing != null;
  }

  async create(
    data: Prisma.LocationDisabledTemplateUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<OneLocationDisabledTemplateType> {
    const client = tx ?? this.prisma;
    return client.locationDisabledTemplate.create({
      data,
      select: oneLocationDisabledTemplateSelectFields,
    });
  }

  async delete(
    locationId: string,
    templateId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.locationDisabledTemplate.delete({
      where: {
        locationId_templateId: { locationId, templateId },
      },
    });
  }
}
