import { Injectable } from '@nestjs/common';
import { ProductTypesResponse } from '@bringit/contracts';
import { ProductTypeRepository } from '../../infrastructure/repositories';

@Injectable()
export class ProductTypesService {
  constructor(private readonly productTypeRepository: ProductTypeRepository) {}

  async getProductTypes(): Promise<ProductTypesResponse> {
    const productTypes = await this.productTypeRepository.findMany({
      typeName: { not: 'topping' },
    });
    return productTypes as ProductTypesResponse;
  }
}
