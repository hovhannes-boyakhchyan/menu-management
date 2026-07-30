import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { ModifierGroupRepository } from './infrastructure/repositories';
import { ModifierRepository } from '../modifiers/infrastructure/repositories';
import { ModifierGroupsService } from './application/services';
import { ModifierGroupsController } from './presentation/http/controllers';

const repositories = [ModifierGroupRepository, ModifierRepository];

@Module({
  imports: [PrismaModule],
  providers: [...repositories, ModifierGroupsService],
  controllers: [ModifierGroupsController],
})
export class ModifierGroupsModule {}
