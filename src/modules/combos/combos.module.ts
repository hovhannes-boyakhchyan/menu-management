import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { CombosController } from './presentation/http/controllers';
import { CombosService } from './application/services';
import {
  ComboRepository,
  ComboSlotRepository,
  ComboSlotChoiceRepository,
} from './infrastructure/repositories';
import { LocationProductTypeRepository } from '../location-product-types/infrastructure/repositories';
import { LocationProductTypesService } from '../location-product-types/application/services';
import { LocationDisabledTemplateRepository } from '../location-disabled-templates/infrastructure/repositories';

const repositories = [
  ComboRepository,
  ComboSlotRepository,
  ComboSlotChoiceRepository,
  LocationProductTypeRepository,
  LocationDisabledTemplateRepository,
];

@Module({
  imports: [PrismaModule],
  providers: [...repositories, CombosService, LocationProductTypesService],
  controllers: [CombosController],
})
export class CombosModule {}
