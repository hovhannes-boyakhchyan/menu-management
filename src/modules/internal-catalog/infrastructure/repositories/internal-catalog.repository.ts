import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  type CatalogComboRow,
  type CatalogProductRow,
  type CatalogProductTypeRow,
  catalogComboSelectFields,
  catalogProductSelectFields,
  catalogProductTypeSelectFields,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class InternalCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  findProductTypes(locationId: string): Promise<CatalogProductTypeRow[]> {
    return this.prisma.locationProductType.findMany({
      where: { locationId },
      select: catalogProductTypeSelectFields,
    });
  }

  findProducts(locationId: string): Promise<CatalogProductRow[]> {
    return this.prisma.product.findMany({
      where: { locationId },
      select: catalogProductSelectFields,
    });
  }

  findCombos(locationId: string): Promise<CatalogComboRow[]> {
    return this.prisma.combo.findMany({
      where: { locationId },
      select: catalogComboSelectFields,
    });
  }
}
