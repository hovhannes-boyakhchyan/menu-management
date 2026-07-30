import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { CatalogTemplatesController } from './presentation/http/controllers';
import { CatalogTemplatesService } from './application/services';
import { CatalogTemplateRepository } from './infrastructure/repositories';

@Module({
  imports: [PrismaModule],
  providers: [CatalogTemplatesService, CatalogTemplateRepository],
  controllers: [CatalogTemplatesController],
})
export class CatalogTemplatesModule {}
