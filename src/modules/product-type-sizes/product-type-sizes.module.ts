import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { ProductTypeSizesController } from './presentation/http/controllers';
import { ProductTypeSizesService } from './application/services';
import { ProductTypeSizeRepository } from './infrastructure/repositories';

@Module({
  imports: [PrismaModule],
  providers: [ProductTypeSizeRepository, ProductTypeSizesService],
  controllers: [ProductTypeSizesController],
})
export class ProductTypeSizesModule {}
