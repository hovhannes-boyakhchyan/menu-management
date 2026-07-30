import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma';
import { ProductsModule } from '../products/products.module';
import { FolderRepository } from './infrastructure/repositories';
import { FoldersService } from './application/services';
import { FoldersController } from './presentation/http/controllers';
import { ComboRepository } from '../combos/infrastructure/repositories';

const repositories = [FolderRepository, ComboRepository];

@Module({
  imports: [PrismaModule, ProductsModule],
  providers: [...repositories, FoldersService],
  controllers: [FoldersController],
})
export class FoldersModule {}
