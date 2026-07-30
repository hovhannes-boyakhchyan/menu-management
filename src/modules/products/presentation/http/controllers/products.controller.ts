import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateProductsRequestSchema,
  UpdateAvailabilityRequestSchema,
  UpdateProductSchema,
} from '@bringit/contracts';
import type { UpdateAvailabilityRequest } from '@bringit/contracts';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { SkipLocalize } from '@bringit/nestjs-http';
import { ProductsService } from '../../../application/services';
import {
  CreateProductsRequestDto,
  ProductEditResponseDto,
  ProductListResponseDto,
  ProductResponseDto,
  UpdateProductRequestDto,
} from '../dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.service.getById(id);
  }

  @Get(':id/edit')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  getByIdForEdit(@Param('id') id: string): Promise<ProductEditResponseDto> {
    return this.service.getByIdForEdit(id);
  }

  @Get(':id/raw')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  getByIdRaw(@Param('id') id: string): Promise<ProductEditResponseDto> {
    return this.service.getByIdForEdit(id);
  }

  @Get('location-product-type/:id')
  @HttpCode(HttpStatus.OK)
  getByTypeId(@Param('id') id: string): Promise<ProductListResponseDto[]> {
    return this.service.getByLocationProductTypeId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodValidationPipe({ schema: CreateProductsRequestSchema }))
    dto: CreateProductsRequestDto,
  ): Promise<{ message: string }> {
    return this.service.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe({ schema: UpdateProductSchema }))
    dto: UpdateProductRequestDto,
  ): Promise<{ message: string }> {
    return this.service.update(id, dto);
  }

  @Patch(':id/availability')
  @HttpCode(HttpStatus.OK)
  updateAvailability(
    @Param('id') id: string,
    @Body(new ZodValidationPipe({ schema: UpdateAvailabilityRequestSchema }))
    dto: UpdateAvailabilityRequest,
  ): Promise<{ message: string }> {
    return this.service.updateAvailability(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
