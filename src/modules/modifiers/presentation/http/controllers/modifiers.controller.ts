import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateAvailabilityRequestSchema } from '@bringit/contracts';
import type { UpdateAvailabilityRequest } from '@bringit/contracts';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { ModifiersService } from '../../../application/services';

@Controller('modifiers')
export class ModifiersController {
  constructor(private readonly service: ModifiersService) {}

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
