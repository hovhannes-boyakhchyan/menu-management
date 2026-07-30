import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SkipLocalize } from '@bringit/nestjs-http';
import { CatalogTemplatesService } from '../../../application/services';
import {
  CatalogTemplateEditResponseDto,
  CatalogTemplateResponseDto,
} from '../dto';

@Controller('catalog-templates')
export class CatalogTemplatesController {
  constructor(private readonly service: CatalogTemplatesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  list(
    @Query('productType') productType?: string,
    @Query('category') category?: string,
  ): Promise<CatalogTemplateResponseDto[]> {
    return this.service.list({
      productType,
      category,
    });
  }

  @Get('edit')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  listForEdit(
    @Query('productType') productType?: string,
    @Query('category') category?: string,
  ): Promise<CatalogTemplateEditResponseDto[]> {
    return this.service.listForEdit({
      productType,
      category,
    });
  }
}
