import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infrastructure/database/prisma';
import { InternalCatalogService } from './application/services';
import { InternalCatalogRepository } from './infrastructure/repositories';
import { InternalCatalogController } from './presentation/http/controllers';

@Module({
  imports: [PrismaModule],
  providers: [InternalCatalogRepository, InternalCatalogService],
  controllers: [InternalCatalogController],
})
export class InternalCatalogModule {}
