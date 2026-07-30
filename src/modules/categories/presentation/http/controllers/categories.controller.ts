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
  CreateCategorySchema,
  ReorderCategoriesSchema,
  SaveCategoryItemsSchema,
  UpdateCategorySchema,
} from '@bringit/contracts';
import { SkipLocalize } from '@bringit/nestjs-http';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { CategoriesService } from '../../../application/services';
import {
  CategoryResponseDto,
  CategoryEditResponseDto,
  CreateCategoryRequestDto,
  MenuCategoryResponseDto,
  ReorderCategoriesRequestDto,
  SaveCategoryItemsRequestDto,
  UpdateCategoryRequestDto,
} from '../dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get('location/:locationId')
  @HttpCode(HttpStatus.OK)
  getByLocationId(
    @Param('locationId') locationId: string,
  ): Promise<CategoryResponseDto[]> {
    return this.service.getByLocationId(locationId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string): Promise<MenuCategoryResponseDto> {
    return this.service.getById(id);
  }

  @Get(':id/edit')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  getByIdForEdit(@Param('id') id: string): Promise<CategoryEditResponseDto> {
    return this.service.getByIdForEdit(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodValidationPipe({ schema: CreateCategorySchema }))
    dto: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.service.create(dto);
  }

  @Patch('positions')
  @HttpCode(HttpStatus.OK)
  reorder(
    @Body(new ZodValidationPipe({ schema: ReorderCategoriesSchema }))
    dto: ReorderCategoriesRequestDto,
  ): Promise<void> {
    return this.service.reorder(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe({ schema: UpdateCategorySchema }))
    dto: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }

  @Put(':id/items')
  @HttpCode(HttpStatus.OK)
  saveItems(
    @Param('id') id: string,
    @Body(new ZodValidationPipe({ schema: SaveCategoryItemsSchema }))
    dto: SaveCategoryItemsRequestDto,
  ): Promise<MenuCategoryResponseDto> {
    return this.service.saveItems(id, dto);
  }
}
