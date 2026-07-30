import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateLocationProductTypeSchema,
  UpdateLocationProductTypeSchema,
  SaveAllLocationProductTypeItemsSchema,
} from '@bringit/contracts';
import { SkipLocalize } from '@bringit/nestjs-http';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { LocationProductTypesService } from '../../../application/services';
import {
  LocationProductTypeResponseDto,
  LocationProductTypeEditResponseDto,
  CreateLocationProductTypeRequestDto,
  UpdateLocationProductTypeRequestDto,
  SaveAllLocationProductTypesRequestDto,
} from '../dto';

@Controller('location-product-types')
export class LocationProductTypesController {
  constructor(private readonly service: LocationProductTypesService) {}

  @Get('location/:locationId')
  @HttpCode(HttpStatus.OK)
  getLocationProductTypes(
    @Param('locationId') locationId: string,
  ): Promise<LocationProductTypeResponseDto[]> {
    return this.service.getLocationProductTypes(locationId);
  }

  @Get(':id/edit')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  getByIdForEdit(
    @Param('id') id: string,
  ): Promise<LocationProductTypeEditResponseDto> {
    return this.service.getByIdForEdit(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createLocationProductType(
    @Body(new ZodValidationPipe({ schema: CreateLocationProductTypeSchema }))
    dto: CreateLocationProductTypeRequestDto,
  ): Promise<LocationProductTypeResponseDto> {
    return this.service.createLocationProductType(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateLocationProductType(
    @Param('id') id: string,
    @Body(new ZodValidationPipe({ schema: UpdateLocationProductTypeSchema }))
    dto: UpdateLocationProductTypeRequestDto,
  ): Promise<LocationProductTypeResponseDto> {
    return this.service.updateLocationProductType(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteLocationProductType(@Param('id') id: string): Promise<void> {
    return this.service.deleteLocationProductType(id);
  }

  @Post('bulk-upsert')
  @HttpCode(HttpStatus.OK)
  upsertLocationProductTypes(
    @Body(
      new ZodValidationPipe({ schema: SaveAllLocationProductTypeItemsSchema }),
    )
    dto: SaveAllLocationProductTypesRequestDto,
  ): Promise<LocationProductTypeResponseDto[]> {
    return this.service.upsertLocationProductTypes(dto);
  }
}
