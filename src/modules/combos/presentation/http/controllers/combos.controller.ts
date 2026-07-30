import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateComboRequestSchema,
  UpdateAvailabilityRequestSchema,
  UpdateComboRequestSchema,
} from '@bringit/contracts';
import type { UpdateAvailabilityRequest } from '@bringit/contracts';
import { SkipLocalize } from '@bringit/nestjs-http';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { CombosService } from '../../../application/services';
import {
  ComboEditResponseDto,
  ComboListResponseDto,
  ComboResponseDto,
  CreateComboRequestDto,
  UpdateComboRequestDto,
} from '../dto';

@Controller('combos')
export class CombosController {
  constructor(private readonly service: CombosService) {}

  @Get('location/:id')
  @HttpCode(HttpStatus.OK)
  getByLocationId(@Param('id') id: string): Promise<ComboListResponseDto[]> {
    return this.service.getByLocationId(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string): Promise<ComboResponseDto> {
    return this.service.getById(id);
  }

  @Get(':id/edit')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  getByIdForEdit(@Param('id') id: string): Promise<ComboEditResponseDto> {
    return this.service.getByIdForEdit(id);
  }

  @Get(':id/raw')
  @SkipLocalize()
  @HttpCode(HttpStatus.OK)
  getByIdRaw(@Param('id') id: string): Promise<ComboEditResponseDto> {
    return this.service.getByIdForEdit(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodValidationPipe({ schema: CreateComboRequestSchema }))
    dto: CreateComboRequestDto,
  ): Promise<{ message: string }> {
    return this.service.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe({ schema: UpdateComboRequestSchema }))
    dto: UpdateComboRequestDto,
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
}
