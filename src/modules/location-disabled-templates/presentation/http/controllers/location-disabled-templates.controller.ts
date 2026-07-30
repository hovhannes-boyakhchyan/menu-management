import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { LocationDisabledTemplatesService } from '../../../application/services';
import {
  LocationDisabledTemplatesResponseDto,
  ToggleLocationDisabledTemplateResponseDto,
} from '../dto';

@Controller('location-disabled-templates')
export class LocationDisabledTemplatesController {
  constructor(private readonly service: LocationDisabledTemplatesService) {}

  @Get(':locationId')
  @HttpCode(HttpStatus.OK)
  getDisabledTemplates(
    @Param('locationId') locationId: string,
  ): Promise<LocationDisabledTemplatesResponseDto> {
    return this.service.getDisabledTemplates(locationId);
  }

  @Patch('toggle/:locationId/:templateId')
  @HttpCode(HttpStatus.OK)
  toggleTemplateStockStatus(
    @Param('locationId') locationId: string,
    @Param('templateId') templateId: string,
  ): Promise<ToggleLocationDisabledTemplateResponseDto> {
    return this.service.toggleTemplateStatus(locationId, templateId);
  }
}
