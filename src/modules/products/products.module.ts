import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { ProductRepository } from './infrastructure/repositories';
import { ProductsService } from './application/services';
import { ProductsController } from './presentation/http/controllers';
import { LocationProductTypeRepository } from '../location-product-types/infrastructure/repositories';
import { ModifierGroupRepository } from '../modifier-groups/infrastructure/repositories';
import { ModifierRepository } from '../modifiers/infrastructure/repositories';
import { LocationProductTypesService } from '../location-product-types/application/services';
import { ModifierGroupsService } from '../modifier-groups/application/services';
import { LocationDisabledTemplateRepository } from '../location-disabled-templates/infrastructure/repositories';

const repositories = [
  ProductRepository,
  LocationProductTypeRepository,
  ModifierGroupRepository,
  ModifierRepository,
  LocationDisabledTemplateRepository,
];

@Module({
  imports: [PrismaModule],
  providers: [
    ...repositories,
    ProductsService,
    LocationProductTypesService,
    ModifierGroupsService,
  ],
  controllers: [ProductsController],
  exports: [ProductRepository],
})
export class ProductsModule {}
