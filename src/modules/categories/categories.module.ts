import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { CategoriesService } from './application/services';
import { CategoryRepository } from './infrastructure/repositories';
import { CategoriesController } from './presentation/http/controllers';
import { ProductRepository } from '../products/infrastructure/repositories';
import { ComboRepository } from '../combos/infrastructure/repositories';
import { LocationDisabledTemplateRepository } from '../location-disabled-templates/infrastructure/repositories';

@Module({
  imports: [PrismaModule],
  providers: [
    CategoryRepository,
    ProductRepository,
    ComboRepository,
    LocationDisabledTemplateRepository,
    CategoriesService,
  ],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
