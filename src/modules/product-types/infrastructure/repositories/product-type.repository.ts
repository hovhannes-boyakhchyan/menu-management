import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  manyProductTypeSelectFields,
  ManyProductType,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class ProductTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where?: Prisma.ProductTypeWhereInput,
  ): Promise<ManyProductType[]> {
    return this.prisma.productType.findMany({
      where,
      select: manyProductTypeSelectFields,
      orderBy: { typeName: 'asc' },
    });
  }
}
