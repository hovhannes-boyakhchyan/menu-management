import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { IconRepository } from './infrastructure/repositories/icon.repository';
import { IconsService } from './application/services/icons.service';
import { IconsController } from './presentation/http/controllers/icons.controller';

@Module({
  imports: [PrismaModule],
  providers: [IconRepository, IconsService],
  controllers: [IconsController],
})
export class IconsModule {}
