import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductTypesService } from '../../../application/services/product-types.service';
import { ProductTypesResponseDto } from '../dto';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly service: ProductTypesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProductTypes(): Promise<ProductTypesResponseDto> {
    return this.service.getProductTypes();
  }
}
