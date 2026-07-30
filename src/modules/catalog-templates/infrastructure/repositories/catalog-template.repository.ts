import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  CatalogTemplateType,
  catalogTemplateSelectFields,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class CatalogTemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByFilter(filter: {
    productType?: string;
    category?: string;
  }): Promise<CatalogTemplateType[]> {
    return this.prisma.catalogTemplate.findMany({
      where: {
        deletedAt: null,
        ...(filter.productType && {
          productType: { typeName: filter.productType },
        }),
        ...(filter.category && { category: filter.category }),
      },
      select: catalogTemplateSelectFields,
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });
  }

  async exists(id: string, tx?: Prisma.TransactionClient): Promise<boolean> {
    const client = tx ?? this.prisma;
    const found = await client.catalogTemplate.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return found !== null;
  }
}
