import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit, { toFile } from '@imagekit/nodejs';
import {
  StorageService,
  StorageUploadParams,
  StorageUploadResult,
} from '../../../shared/storage/storage.interface';
import { buildImageKitFolder, getImageKitConfig } from '../../../config';

@Injectable()
export class ImageKitStorageService implements StorageService {
  private readonly client: ImageKit;

  constructor(private readonly configService: ConfigService) {
    const config = getImageKitConfig(this.configService);

    this.client = new ImageKit({
      privateKey: config.privateKey,
    });
  }

  async uploadImage(params: StorageUploadParams): Promise<StorageUploadResult> {
    const { buffer, filename, mimeType } = params;
    const config = getImageKitConfig(this.configService);

    const file = await toFile(buffer, filename, {
      type: mimeType ?? undefined,
    });

    const response = await this.client.files.upload({
      file,
      fileName: filename,
      folder: buildImageKitFolder(config),
      customMetadata: {
        used: true,
      },
    });

    return {
      url: response.url,
      fileId: response.fileId,
      provider: 'imagekit',
      raw: response,
    };
  }

  async deleteImage(fileId: string): Promise<void> {
    await this.client.files.delete(fileId);
  }
}
