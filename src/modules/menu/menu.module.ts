import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { MenuController } from './presentation/http/controllers';
import { MenuService } from './application/services';
import { CategoriesModule } from '../categories/categories.module';
import { LocationDisabledTemplateRepository } from '../location-disabled-templates/infrastructure/repositories';

@Module({
  imports: [PrismaModule, CategoriesModule],
  providers: [MenuService, LocationDisabledTemplateRepository],
  controllers: [MenuController],
})
export class MenuModule {}
