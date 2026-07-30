import { Module } from '@nestjs/common';
import { StorageModule } from '../../infrastructure/storage/storage.module';
import { ImageUploadController } from './presentation/http/controllers/image-upload.controller';
import { ImageUploadService } from './aplication/services';

@Module({
  imports: [StorageModule],
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
})
export class ImageUploadModule {}
