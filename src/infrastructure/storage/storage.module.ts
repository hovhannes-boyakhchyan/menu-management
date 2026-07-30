import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageKitStorageService } from './imagekit/imagekit.storage.service';
import { STORAGE_SERVICE } from '../../shared/storage/storage.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: ImageKitStorageService,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
