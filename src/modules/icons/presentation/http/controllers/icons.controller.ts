import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { IconsService } from '../../../application/services/icons.service';
import { IconsQueryDto, IconsResponseDto } from '../dto';

@Controller('icons')
export class IconsController {
  constructor(private readonly service: IconsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getIcons(@Query() query: IconsQueryDto): Promise<IconsResponseDto> {
    return this.service.getIcons(query);
  }
}
