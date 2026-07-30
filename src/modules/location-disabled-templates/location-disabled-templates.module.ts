import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { LocationDisabledTemplateRepository } from './infrastructure/repositories';
import { LocationDisabledTemplatesService } from './application/services';
import { LocationDisabledTemplatesController } from './presentation/http/controllers';
import { CatalogTemplateRepository } from '../catalog-templates/infrastructure/repositories';

@Module({
  imports: [PrismaModule],
  providers: [
    LocationDisabledTemplatesService,
    LocationDisabledTemplateRepository,
    CatalogTemplateRepository,
  ],
  controllers: [LocationDisabledTemplatesController],
})
export class LocationDisabledTemplatesModule {}
