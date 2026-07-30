import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { ModifierRepository } from './infrastructure/repositories';
import { ModifiersService } from './application/services';
import { ModifiersController } from './presentation/http/controllers';

@Module({
  imports: [PrismaModule],
  providers: [ModifierRepository, ModifiersService],
  controllers: [ModifiersController],
})
export class ModifiersModule {}
