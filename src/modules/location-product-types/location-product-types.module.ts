import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { LocationProductTypeRepository } from './infrastructure/repositories';
import { LocationProductTypesService } from './application/services/location-product-types.service';
import { LocationProductTypesController } from './presentation/http/controllers/location-product-types.controller';

@Module({
  imports: [PrismaModule],
  providers: [LocationProductTypeRepository, LocationProductTypesService],
  controllers: [LocationProductTypesController],
})
export class LocationProductTypesModule {}
