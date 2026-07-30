import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { ProductTypeRepository } from './infrastructure/repositories';
import { ProductTypesService } from './application/services/product-types.service';
import { ProductTypesController } from './presentation/http/controllers/product-types.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductTypeRepository, ProductTypesService],
  controllers: [ProductTypesController],
})
export class ProductTypesModule {}
