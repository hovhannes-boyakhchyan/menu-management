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
  Query,
} from '@nestjs/common';
import {
  CreateProductTypeSizeRequestSchema,
  UpdateProductTypeSizeRequestSchema,
} from '@bringit/contracts';
import { SkipLocalize } from '@bringit/nestjs-http';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { ProductTypeSizesService } from '../../../application/services';
import {
  CreateProductTypeSizeRequestDto,
  ProductTypeSizeResponseDto,
  ProductTypeSizeEditResponseDto,
  UpdateProductTypeSizeRequestDto,
} from '../dto';

@Controller('product-type-sizes')
export class ProductTypeSizesController {
  constructor(private readonly service: ProductTypeSizesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  list(
    @Query('locationProductTypeId') locationProductTypeId: string,
  ): Promise<ProductTypeSizeResponseDto[]> {
    return this.service.listByLocationProductType(locationProductTypeId);
  }

  @Get(':id/edit')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  getByIdForEdit(
    @Param('id') id: string,
  ): Promise<ProductTypeSizeEditResponseDto> {
    return this.service.getByIdForEdit(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodValidationPipe({ schema: CreateProductTypeSizeRequestSchema }))
    dto: CreateProductTypeSizeRequestDto,
  ): Promise<ProductTypeSizeResponseDto> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe({ schema: UpdateProductTypeSizeRequestSchema }))
    dto: UpdateProductTypeSizeRequestDto,
  ): Promise<ProductTypeSizeResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
