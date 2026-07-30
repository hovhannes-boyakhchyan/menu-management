import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ModifierGroupsService } from '../../../application/services';

@Controller('modifier-groups')
export class ModifierGroupsController {
  constructor(private readonly service: ModifierGroupsService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
