import type {
  LocalizedText,
  LocationCatalogSnapshot,
} from '@bringit/contracts';
import { Injectable } from '@nestjs/common';

import { asLocalized } from '../../../../infrastructure/database/prisma';
import { InternalCatalogRepository } from '../../infrastructure/repositories';

@Injectable()
export class InternalCatalogService {
  constructor(private readonly repository: InternalCatalogRepository) {}

  async getLocationCatalog(
    locationId: string,
  ): Promise<LocationCatalogSnapshot> {
    const [productTypes, products, combos] = await Promise.all([
      this.repository.findProductTypes(locationId),
      this.repository.findProducts(locationId),
      this.repository.findCombos(locationId),
    ]);

    return {
      productTypes: productTypes.map((type) => ({
        id: type.id,
        typeName: type.productType.typeName,
        name: asLocalized<LocalizedText>(type.name),
        deletedAt: type.deletedAt?.toISOString() ?? null,
      })),
      products: products.map((product) => ({
        id: product.id,
        locationProductTypeId: product.locationProductTypeId,
        name: asLocalized<LocalizedText>(product.name),
        imageUrl: product.imageUrl,
        price: product.price,
        deliveryPrice: product.deliveryPrice,
        deletedAt: product.deletedAt?.toISOString() ?? null,
      })),
      combos: combos.map((combo) => ({
        id: combo.id,
        name: asLocalized<LocalizedText>(combo.name),
        imageUrl: combo.imageUrl,
        price: combo.price,
        deliveryPrice: combo.deliveryPrice,
        deletedAt: combo.deletedAt?.toISOString() ?? null,
      })),
    };
  }
}
